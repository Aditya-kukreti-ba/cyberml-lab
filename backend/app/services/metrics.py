from typing import Any, Optional
import numpy as np
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    mean_absolute_error,
    mean_squared_error,
    r2_score,
    roc_curve,
    auc,
)


def compute_classification_metrics(
    y_true: np.ndarray,
    y_pred: np.ndarray,
    y_proba: Optional[np.ndarray] = None,
    classes: Optional[np.ndarray] = None,
) -> dict[str, Any]:
    """Compute all classification metrics including confusion matrix and ROC data.

    Args:
        y_true: Ground-truth class labels.
        y_pred: Predicted class labels.
        y_proba: Class probability estimates (required for ROC).
        classes: Ordered list of class labels.

    Returns:
        Dict with accuracy, precision, recall, f1, confusion_matrix, and optional roc data.
    """
    unique_labels = np.unique(y_true)
    # Use "binary" only when labels are numeric 0/1; fall back to "weighted" for string labels
    is_binary_numeric = len(unique_labels) == 2 and set(unique_labels).issubset({0, 1})
    average = "binary" if is_binary_numeric else "weighted"

    result: dict[str, Any] = {
        "accuracy": float(accuracy_score(y_true, y_pred)),
        "precision": float(precision_score(y_true, y_pred, average=average, zero_division=0)),
        "recall": float(recall_score(y_true, y_pred, average=average, zero_division=0)),
        "f1_score": float(f1_score(y_true, y_pred, average=average, zero_division=0)),
    }

    cm_data = generate_confusion_matrix_data(y_true, y_pred, classes)
    result["confusion_matrix"] = cm_data["matrix"]
    result["confusion_matrix_labels"] = cm_data["labels"]

    if y_proba is not None:
        roc_data = generate_roc_data(y_true, y_proba)
        result["roc_fpr"] = roc_data["fpr"]
        result["roc_tpr"] = roc_data["tpr"]
        result["roc_auc"] = roc_data["auc"]

    return result


def compute_regression_metrics(
    y_true: np.ndarray,
    y_pred: np.ndarray,
) -> dict[str, Any]:
    """Compute MAE, MSE, RMSE, R² and generate chart data for regression results.

    Args:
        y_true: Ground-truth continuous values.
        y_pred: Predicted continuous values.

    Returns:
        Dict with mae, mse, rmse, r2, predictions, actuals, and residuals.
    """
    mae = float(mean_absolute_error(y_true, y_pred))
    mse = float(mean_squared_error(y_true, y_pred))
    rmse = float(np.sqrt(mse))
    r2 = float(r2_score(y_true, y_pred))
    residuals = (np.array(y_true, dtype=float) - np.array(y_pred, dtype=float)).tolist()

    return {
        "mae": mae,
        "mse": mse,
        "rmse": rmse,
        "r2": r2,
        "predictions": [float(v) for v in y_pred],
        "actuals": [float(v) for v in y_true],
        "residuals": residuals,
    }


def generate_confusion_matrix_data(
    y_true: np.ndarray,
    y_pred: np.ndarray,
    classes: Optional[np.ndarray] = None,
) -> dict[str, Any]:
    """Build confusion matrix and derive readable labels.

    Args:
        y_true: Ground-truth class labels.
        y_pred: Predicted class labels.
        classes: Optional ordered class labels for axis labels.

    Returns:
        Dict with 'matrix' (list[list[int]]) and 'labels' (list[str]).
    """
    if classes is None:
        classes = np.unique(np.concatenate([y_true, y_pred]))

    cm = confusion_matrix(y_true, y_pred, labels=classes)
    return {
        "matrix": cm.tolist(),
        "labels": [str(c) for c in classes],
    }


def generate_roc_data(
    y_true: np.ndarray,
    y_proba: np.ndarray,
) -> dict[str, Any]:
    """Compute ROC curve FPR/TPR pairs and AUC score.

    For multi-class problems, uses the positive class probability (last column).

    Args:
        y_true: Ground-truth class labels.
        y_proba: Class probability array from predict_proba.

    Returns:
        Dict with 'fpr', 'tpr', and 'auc' (all as Python floats/lists).
    """
    unique_classes = np.unique(y_true)

    if len(unique_classes) == 2:
        # Binary classification — use the positive class column
        pos_proba = y_proba[:, 1]
        fpr, tpr, _ = roc_curve(y_true, pos_proba, pos_label=unique_classes[1])
    else:
        # Multi-class: binarize against the most common class as positive
        pos_label = unique_classes[-1]
        pos_proba = y_proba[:, -1]
        y_binary = (y_true == pos_label).astype(int)
        fpr, tpr, _ = roc_curve(y_binary, pos_proba)

    roc_auc = float(auc(fpr, tpr))
    return {
        "fpr": [float(v) for v in fpr],
        "tpr": [float(v) for v in tpr],
        "auc": roc_auc,
    }
