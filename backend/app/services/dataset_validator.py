from typing import Any
import io
import numpy as np
import pandas as pd
from fastapi import UploadFile, HTTPException


MAX_FILE_SIZE_MB = 50
MAX_ROWS = 100_000
ALLOWED_EXTENSIONS = {".csv"}


def validate_csv(file: UploadFile) -> bytes:
    """Validate an uploaded CSV file and return its raw bytes.

    Checks file extension, MIME type, and file size limit.

    Args:
        file: The uploaded file object from FastAPI.

    Returns:
        Raw file bytes if valid.

    Raises:
        HTTPException: If the file is invalid.
    """
    if file.filename is None or not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are accepted.")

    content = file.file.read()
    size_mb = len(content) / (1024 * 1024)
    if size_mb > MAX_FILE_SIZE_MB:
        raise HTTPException(
            status_code=413,
            detail=f"File too large ({size_mb:.1f} MB). Maximum allowed size is {MAX_FILE_SIZE_MB} MB.",
        )

    # Attempt to decode to detect binary files
    try:
        content.decode("utf-8")
    except UnicodeDecodeError:
        try:
            content.decode("latin-1")
        except Exception:
            raise HTTPException(status_code=400, detail="File encoding not supported. Please use UTF-8 or Latin-1 CSV.")

    return content


def read_csv_bytes(content: bytes) -> pd.DataFrame:
    """Parse validated CSV bytes into a DataFrame.

    Args:
        content: Raw CSV bytes.

    Returns:
        Parsed DataFrame.

    Raises:
        HTTPException: If parsing fails.
    """
    try:
        df = pd.read_csv(io.BytesIO(content))
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV: {str(exc)}")

    if df.empty:
        raise HTTPException(status_code=400, detail="The uploaded CSV file is empty.")

    if len(df) > MAX_ROWS:
        raise HTTPException(
            status_code=400,
            detail=f"Dataset has {len(df):,} rows which exceeds the {MAX_ROWS:,}-row limit. Please upload a smaller sample.",
        )

    return df


def detect_column_types(df: pd.DataFrame) -> dict[str, str]:
    """Classify each column as 'numerical' or 'categorical'.

    Args:
        df: Input dataframe.

    Returns:
        Dict mapping column name → 'numerical' | 'categorical'.
    """
    result: dict[str, str] = {}
    for col in df.columns:
        if pd.api.types.is_numeric_dtype(df[col]):
            result[col] = "numerical"
        else:
            result[col] = "categorical"
    return result


def get_dataset_summary(df: pd.DataFrame) -> dict[str, Any]:
    """Compute per-column statistics and a data preview.

    Args:
        df: Input dataframe.

    Returns:
        Dict with column_info list and a preview of the first 10 rows.
    """
    column_types = detect_column_types(df)
    column_info = []

    for col in df.columns:
        series = df[col]
        sample_values = series.dropna().head(5).tolist()
        # Convert numpy types to Python native for JSON serialization
        sample_values = [
            v.item() if hasattr(v, "item") else v for v in sample_values
        ]
        column_info.append(
            {
                "name": col,
                "dtype": str(series.dtype),
                "kind": column_types[col],
                "missing_count": int(series.isnull().sum()),
                "unique_count": int(series.nunique()),
                "sample_values": sample_values,
            }
        )

    preview_df = df.head(10).copy()
    for col in preview_df.select_dtypes(include=[np.number]).columns:
        preview_df[col] = preview_df[col].where(preview_df[col].notna(), None)

    preview = preview_df.where(pd.notnull(preview_df), None).to_dict(orient="records")

    return {"column_info": column_info, "preview": preview}
