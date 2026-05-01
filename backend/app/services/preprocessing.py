from typing import Any
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler, MinMaxScaler


def handle_missing_values(df: pd.DataFrame, strategy: str = "mean") -> pd.DataFrame:
    """Fill or drop missing values across the dataframe.

    Args:
        df: Input dataframe.
        strategy: One of 'drop', 'mean', 'median', 'mode'.

    Returns:
        Dataframe with missing values handled.
    """
    df = df.copy()
    if strategy == "drop":
        df = df.dropna()
    elif strategy in ("mean", "median"):
        for col in df.select_dtypes(include=[np.number]).columns:
            if df[col].isnull().any():
                fill_val = df[col].mean() if strategy == "mean" else df[col].median()
                df[col] = df[col].fillna(fill_val)
        for col in df.select_dtypes(exclude=[np.number]).columns:
            if df[col].isnull().any():
                df[col] = df[col].fillna(df[col].mode().iloc[0] if not df[col].mode().empty else "unknown")
    elif strategy == "mode":
        for col in df.columns:
            if df[col].isnull().any():
                mode_val = df[col].mode()
                df[col] = df[col].fillna(mode_val.iloc[0] if not mode_val.empty else 0)
    return df


def encode_categoricals(
    df: pd.DataFrame,
    columns: list[str],
    method: str = "label",
    fitted_encoders: dict[str, Any] | None = None,
) -> tuple[pd.DataFrame, dict[str, Any]]:
    """Encode categorical columns using label or one-hot encoding.

    Args:
        df: Input dataframe.
        columns: List of categorical column names to encode.
        method: 'label' or 'onehot'.
        fitted_encoders: Previously fitted encoders (for transform-only calls).

    Returns:
        Tuple of (transformed dataframe, encoder mapping).
    """
    df = df.copy()
    encoders: dict[str, Any] = fitted_encoders or {}

    if method == "label":
        for col in columns:
            if col not in df.columns:
                continue
            if col not in encoders:
                le = LabelEncoder()
                df[col] = le.fit_transform(df[col].astype(str))
                encoders[col] = le
            else:
                le = encoders[col]
                known_classes = set(le.classes_)
                df[col] = df[col].astype(str).apply(
                    lambda x: x if x in known_classes else le.classes_[0]
                )
                df[col] = le.transform(df[col])

    elif method == "onehot":
        for col in columns:
            if col not in df.columns:
                continue
            dummies = pd.get_dummies(df[col].astype(str), prefix=col, drop_first=False)
            df = pd.concat([df.drop(columns=[col]), dummies], axis=1)

    return df, encoders


def scale_features(
    df: pd.DataFrame,
    columns: list[str],
    method: str = "standard",
    fitted_scaler: Any | None = None,
) -> tuple[pd.DataFrame, Any]:
    """Scale numerical feature columns.

    Args:
        df: Input dataframe.
        columns: List of column names to scale.
        method: 'standard', 'minmax', or 'none'.
        fitted_scaler: A pre-fitted scaler (for transform-only calls).

    Returns:
        Tuple of (scaled dataframe, fitted scaler or None).
    """
    df = df.copy()
    cols_present = [c for c in columns if c in df.columns]

    if method == "none" or not cols_present:
        return df, None

    if fitted_scaler is None:
        scaler = StandardScaler() if method == "standard" else MinMaxScaler()
        df[cols_present] = scaler.fit_transform(df[cols_present])
        return df, scaler
    else:
        df[cols_present] = fitted_scaler.transform(df[cols_present])
        return df, fitted_scaler


def split_data(
    X: np.ndarray,
    y: np.ndarray,
    test_size: float = 0.2,
    random_state: int = 42,
) -> tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    """Split feature matrix and target vector into train/test sets.

    Args:
        X: Feature matrix.
        y: Target vector.
        test_size: Fraction of data to use for testing.
        random_state: Seed for reproducibility.

    Returns:
        Tuple of (X_train, X_test, y_train, y_test).
    """
    return train_test_split(X, y, test_size=test_size, random_state=random_state)


def prepare_features(
    df: pd.DataFrame,
    feature_columns: list[str],
    target_column: str,
    missing_strategy: str = "mean",
    encoding_method: str = "label",
    scaling_method: str = "standard",
    test_size: float = 0.2,
) -> dict[str, Any]:
    """Full preprocessing pipeline: missing → encode → scale → split.

    Returns a dict with X_train, X_test, y_train, y_test, feature_names,
    encoders, and scaler for use by the training routes.
    """
    df = df[feature_columns + [target_column]].copy()
    df = handle_missing_values(df, strategy=missing_strategy)

    # Separate target before encoding features
    y = df[target_column].values
    X_df = df[feature_columns].copy()

    # Detect categorical columns among features
    cat_cols = X_df.select_dtypes(exclude=[np.number]).columns.tolist()
    X_df, encoders = encode_categoricals(X_df, cat_cols, method=encoding_method)

    # Ensure all columns are numeric after encoding
    X_df = X_df.apply(pd.to_numeric, errors="coerce").fillna(0)

    feature_names = X_df.columns.tolist()
    X_df, scaler = scale_features(X_df, feature_names, method=scaling_method)

    X = X_df.values
    X_train, X_test, y_train, y_test = split_data(X, y, test_size=test_size)

    return {
        "X_train": X_train,
        "X_test": X_test,
        "y_train": y_train,
        "y_test": y_test,
        "feature_names": feature_names,
        "encoders": encoders,
        "scaler": scaler,
    }
