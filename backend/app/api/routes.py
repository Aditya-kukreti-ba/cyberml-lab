import time
from pathlib import Path
from typing import Any

import numpy as np
from fastapi import APIRouter, File, HTTPException, UploadFile

from app.models.decision_tree_model import DecisionTreeModel
from app.models.linear_regression_model import LinearRegressionModel
from app.models.logistic_regression_model import LogisticRegressionModel
from app.models.naive_bayes_model import NaiveBayesModel
from app.models.svm_model import SVMModel
from app.schemas.request_schemas import CompareRequest, TrainRequest
from app.schemas.response_schemas import (
    ClassificationMetrics,
    CompareResponse,
    DatasetInfo,
    DefaultDatasetEntry,
    RegressionMetrics,
    TrainResponse,
    UploadResponse,
)
from app.services.dataset_validator import get_dataset_summary, read_csv_bytes, validate_csv
from app.services.metrics import compute_classification_metrics, compute_regression_metrics
from app.services.preprocessing import prepare_features
from app.utils.file_handler import read_csv, save_builtin_as_temp, save_upload

router = APIRouter()

# ─────────────────────────────────────────────────────────────
# Built-in dataset registry
# ─────────────────────────────────────────────────────────────

BUILTIN_DATASETS: list[DefaultDatasetEntry] = [
    DefaultDatasetEntry(
        id="nsl_kdd_sample",
        name="NSL-KDD Network Intrusion",
        description="Synthetic NSL-KDD-style dataset for intrusion detection. Binary classification (normal/attack) or regression on duration/risk_score.",
        rows=1000,
        columns=12,
        recommended_target="label",
        problem_types=["classification", "regression"],
    ),
    DefaultDatasetEntry(
        id="phishing_url",
        name="Phishing URL Detection",
        description="URL-derived features for detecting phishing vs legitimate websites. Binary classification.",
        rows=1000,
        columns=10,
        recommended_target="is_phishing",
        problem_types=["classification"],
    ),
    DefaultDatasetEntry(
        id="network_anomaly",
        name="Network Traffic Anomaly",
        description="Continuous network traffic features suitable for anomaly scoring via regression.",
        rows=1000,
        columns=9,
        recommended_target="anomaly_score",
        problem_types=["regression"],
    ),
    DefaultDatasetEntry(
        id="spam_sms",
        name="SMS Spam Detection",
        description="5,572 SMS messages with 14 engineered text features (length, keyword flags, digit count). Binary classification: ham (0) vs spam (1).",
        rows=5572,
        columns=15,
        recommended_target="label",
        problem_types=["classification"],
    ),
    DefaultDatasetEntry(
        id="risk_score",
        name="Demographic Risk Scoring",
        description="221 records with race, gender, and age group. Predict continuous risk_score (regression) or high_risk flag (classification).",
        rows=221,
        columns=5,
        recommended_target="risk_score",
        problem_types=["classification", "regression"],
    ),
    DefaultDatasetEntry(
        id="pima_diabetes",
        name="Pima Indians Diabetes (Kaggle)",
        description="Real-world UCI/Kaggle dataset: 768 patients, 8 medical features. Binary classification: diabetic (1) vs non-diabetic (0). Models typically score 65–80% — NOT 100%.",
        rows=768,
        columns=9,
        recommended_target="outcome",
        problem_types=["classification"],
    ),
]


def _build_model(algorithm: str, problem_type: str, hyperparameters: dict[str, Any]):
    """Instantiate the correct model class based on algorithm name."""
    hp = hyperparameters or {}
    if algorithm == "linear_regression":
        return LinearRegressionModel(**hp)
    elif algorithm == "logistic_regression":
        return LogisticRegressionModel(**hp)
    elif algorithm == "svm":
        return SVMModel(problem_type=problem_type, **hp)
    elif algorithm == "decision_tree":
        return DecisionTreeModel(problem_type=problem_type, **hp)
    elif algorithm == "naive_bayes":
        if problem_type != "classification":
            raise HTTPException(status_code=400, detail="Naive Bayes only supports classification.")
        return NaiveBayesModel(**hp)
    else:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown algorithm '{algorithm}'. Valid options: linear_regression, logistic_regression, svm, decision_tree, naive_bayes.",
        )


def _run_training(
    df,
    target_column: str,
    feature_columns: list[str],
    algorithm: str,
    problem_type: str,
    hyperparameters: dict[str, Any],
    missing_strategy: str,
    encoding_method: str,
    scaling_method: str,
    test_size: float,
) -> TrainResponse:
    """Full training pipeline: preprocess → train → evaluate."""
    if target_column not in df.columns:
        raise HTTPException(status_code=400, detail=f"Target column '{target_column}' not found in dataset.")
    missing_features = [c for c in feature_columns if c not in df.columns]
    if missing_features:
        raise HTTPException(status_code=400, detail=f"Feature columns not found: {missing_features}")

    prep = prepare_features(
        df,
        feature_columns=feature_columns,
        target_column=target_column,
        missing_strategy=missing_strategy,
        encoding_method=encoding_method,
        scaling_method=scaling_method,
        test_size=test_size,
    )

    X_train = prep["X_train"]
    X_test = prep["X_test"]
    y_train = prep["y_train"]
    y_test = prep["y_test"]
    feature_names = prep["feature_names"]

    model = _build_model(algorithm, problem_type, hyperparameters)

    start = time.perf_counter()
    model.train(X_train, y_train)
    elapsed = time.perf_counter() - start

    y_pred = model.predict(X_test)

    classification_metrics = None
    regression_metrics = None
    feature_importances = None

    if problem_type == "classification":
        y_proba = None
        if hasattr(model, "predict_proba"):
            try:
                y_proba = model.predict_proba(X_test)
            except Exception:
                pass

        classes = getattr(model, "classes_", None)
        cm_data = compute_classification_metrics(y_test, y_pred, y_proba, classes)
        classification_metrics = ClassificationMetrics(**cm_data)

    else:
        reg_data = compute_regression_metrics(y_test, y_pred)
        regression_metrics = RegressionMetrics(**reg_data)

    if hasattr(model, "get_feature_importances"):
        try:
            feature_importances = model.get_feature_importances(feature_names)
        except Exception:
            pass

    tree_structure = None
    if algorithm == "decision_tree" and hasattr(model, "get_tree_structure"):
        try:
            class_names = None
            if problem_type == "classification":
                class_names = [str(c) for c in getattr(model, "classes_", [])]
            tree_structure = model.get_tree_structure(feature_names, class_names, max_depth=4)
        except Exception:
            pass

    return TrainResponse(
        success=True,
        algorithm=algorithm,
        problem_type=problem_type,
        training_time_seconds=round(elapsed, 4),
        train_samples=len(X_train),
        test_samples=len(X_test),
        feature_count=len(feature_names),
        classification_metrics=classification_metrics,
        regression_metrics=regression_metrics,
        feature_importances=feature_importances,
        tree_structure=tree_structure,
        hyperparameters_used=hyperparameters,
    )


# ─────────────────────────────────────────────────────────────
# Endpoints
# ─────────────────────────────────────────────────────────────


@router.post("/upload", response_model=UploadResponse)
async def upload_csv(file: UploadFile = File(...)):
    """Upload a CSV file and receive a dataset_id for subsequent requests."""
    content = validate_csv(file)
    df = read_csv_bytes(content)
    dataset_id = save_upload(content, file.filename or "upload.csv")
    summary = get_dataset_summary(df)

    dataset_info = DatasetInfo(
        dataset_id=dataset_id,
        name=file.filename or "Uploaded Dataset",
        rows=len(df),
        columns=len(df.columns),
        column_info=summary["column_info"],
        preview=summary["preview"],
    )
    return UploadResponse(
        success=True,
        dataset_id=dataset_id,
        message=f"Dataset uploaded successfully: {len(df):,} rows × {len(df.columns)} columns",
        dataset_info=dataset_info,
    )


@router.get("/datasets/default", response_model=list[DefaultDatasetEntry])
async def list_default_datasets():
    """List all built-in cybersecurity datasets."""
    return BUILTIN_DATASETS


@router.get("/datasets/default/{name}", response_model=UploadResponse)
async def load_default_dataset(name: str):
    """Load a built-in dataset by name and return a usable dataset_id."""
    valid_names = {d.id for d in BUILTIN_DATASETS}
    if name not in valid_names:
        raise HTTPException(status_code=404, detail=f"Built-in dataset '{name}' not found. Valid options: {sorted(valid_names)}")

    from app.utils.file_handler import read_builtin_csv
    df = read_builtin_csv(name)
    dataset_id = save_builtin_as_temp(name)
    summary = get_dataset_summary(df)
    entry = next(d for d in BUILTIN_DATASETS if d.id == name)

    dataset_info = DatasetInfo(
        dataset_id=dataset_id,
        name=entry.name,
        rows=len(df),
        columns=len(df.columns),
        column_info=summary["column_info"],
        preview=summary["preview"],
    )
    return UploadResponse(
        success=True,
        dataset_id=dataset_id,
        message=f"Loaded '{entry.name}': {len(df):,} rows × {len(df.columns)} columns",
        dataset_info=dataset_info,
    )


@router.get("/dataset/columns")
async def get_column_info(dataset_id: str):
    """Return column metadata for a previously loaded dataset."""
    df = read_csv(dataset_id)
    summary = get_dataset_summary(df)
    return {"dataset_id": dataset_id, "column_info": summary["column_info"]}


@router.post("/preprocess")
async def preprocess_dataset(payload: dict):
    """Apply preprocessing and return a preview of the processed feature matrix."""
    dataset_id = payload.get("dataset_id")
    target_column = payload.get("target_column")
    feature_columns = payload.get("feature_columns", [])
    missing_strategy = payload.get("missing_strategy", "mean")
    encoding_method = payload.get("encoding_method", "label")
    scaling_method = payload.get("scaling_method", "standard")
    test_size = float(payload.get("test_size", 0.2))

    if not dataset_id or not target_column or not feature_columns:
        raise HTTPException(status_code=400, detail="dataset_id, target_column, and feature_columns are required.")

    df = read_csv(dataset_id)
    prep = prepare_features(
        df,
        feature_columns=feature_columns,
        target_column=target_column,
        missing_strategy=missing_strategy,
        encoding_method=encoding_method,
        scaling_method=scaling_method,
        test_size=test_size,
    )

    return {
        "success": True,
        "train_samples": len(prep["X_train"]),
        "test_samples": len(prep["X_test"]),
        "feature_count": len(prep["feature_names"]),
        "feature_names": prep["feature_names"],
        "message": f"Preprocessing complete: {len(prep['X_train'])} train / {len(prep['X_test'])} test samples",
    }


@router.post("/train", response_model=TrainResponse)
async def train_model(request: TrainRequest):
    """Train a single ML model and return metrics + chart data."""
    df = read_csv(request.dataset_id)
    try:
        return _run_training(
            df=df,
            target_column=request.target_column,
            feature_columns=request.feature_columns,
            algorithm=request.algorithm,
            problem_type=request.problem_type,
            hyperparameters=request.hyperparameters,
            missing_strategy=request.missing_strategy,
            encoding_method=request.encoding_method,
            scaling_method=request.scaling_method,
            test_size=request.test_size,
        )
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/compare", response_model=CompareResponse)
async def compare_models(request: CompareRequest):
    """Train multiple algorithms on the same dataset and return side-by-side results."""
    df = read_csv(request.dataset_id)
    results = []

    for algorithm in request.algorithms:
        hp = request.hyperparameters.get(algorithm, {})
        try:
            result = _run_training(
                df=df,
                target_column=request.target_column,
                feature_columns=request.feature_columns,
                algorithm=algorithm,
                problem_type=request.problem_type,
                hyperparameters=hp,
                missing_strategy=request.missing_strategy,
                encoding_method=request.encoding_method,
                scaling_method=request.scaling_method,
                test_size=request.test_size,
            )
            results.append(result)
        except Exception:
            results.append(
                TrainResponse(
                    success=False,
                    algorithm=algorithm,
                    problem_type=request.problem_type,
                    training_time_seconds=0.0,
                    train_samples=0,
                    test_samples=0,
                    feature_count=0,
                    hyperparameters_used=hp,
                )
            )

    return CompareResponse(success=True, problem_type=request.problem_type, results=results)
