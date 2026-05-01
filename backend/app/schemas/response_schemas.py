from typing import Any, Optional
from pydantic import BaseModel


class ColumnInfo(BaseModel):
    name: str
    dtype: str
    kind: str  # "numerical" or "categorical"
    missing_count: int
    unique_count: int
    sample_values: list[Any]


class DatasetInfo(BaseModel):
    dataset_id: str
    name: str
    rows: int
    columns: int
    column_info: list[ColumnInfo]
    preview: list[dict[str, Any]]  # first 10 rows as records


class UploadResponse(BaseModel):
    success: bool
    dataset_id: str
    message: str
    dataset_info: DatasetInfo


class ClassificationMetrics(BaseModel):
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    confusion_matrix: list[list[int]]
    confusion_matrix_labels: list[str]
    roc_fpr: Optional[list[float]] = None
    roc_tpr: Optional[list[float]] = None
    roc_auc: Optional[float] = None


class RegressionMetrics(BaseModel):
    mae: float
    mse: float
    rmse: float
    r2: float
    predictions: list[float]
    actuals: list[float]
    residuals: list[float]


class TrainResponse(BaseModel):
    success: bool
    algorithm: str
    problem_type: str
    training_time_seconds: float
    train_samples: int
    test_samples: int
    feature_count: int
    classification_metrics: Optional[ClassificationMetrics] = None
    regression_metrics: Optional[RegressionMetrics] = None
    feature_importances: Optional[dict[str, float]] = None
    tree_structure: Optional[dict[str, Any]] = None
    hyperparameters_used: dict[str, Any]


class CompareResponse(BaseModel):
    success: bool
    problem_type: str
    results: list[TrainResponse]


class DefaultDatasetEntry(BaseModel):
    id: str
    name: str
    description: str
    rows: int
    columns: int
    recommended_target: str
    problem_types: list[str]
