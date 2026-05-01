import os
import uuid
import tempfile
from pathlib import Path
from typing import Optional
import pandas as pd
from fastapi import HTTPException


TEMP_DIR = Path(tempfile.gettempdir()) / "cyberml_lab"
TEMP_DIR.mkdir(parents=True, exist_ok=True)


def save_upload(content: bytes, original_filename: str) -> str:
    """Save uploaded CSV bytes to a uniquely named temp file.

    Args:
        content: Raw bytes of the uploaded file.
        original_filename: Original file name (used only for extension check).

    Returns:
        A unique dataset_id (UUID string) that maps to the temp file path.

    Raises:
        HTTPException: If the extension is not .csv.
    """
    suffix = Path(original_filename).suffix.lower()
    if suffix != ".csv":
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")

    dataset_id = str(uuid.uuid4())
    file_path = TEMP_DIR / f"{dataset_id}.csv"
    file_path.write_bytes(content)
    return dataset_id


def read_csv(dataset_id: str) -> pd.DataFrame:
    """Read a previously saved dataset by its dataset_id.

    Args:
        dataset_id: UUID returned from save_upload or a built-in dataset name.

    Returns:
        Parsed DataFrame.

    Raises:
        HTTPException: If the file does not exist or cannot be parsed.
    """
    file_path = TEMP_DIR / f"{dataset_id}.csv"
    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Dataset '{dataset_id}' not found. It may have expired. Please re-upload.",
        )
    try:
        return pd.read_csv(file_path)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to read dataset: {str(exc)}")


def read_builtin_csv(name: str) -> pd.DataFrame:
    """Load a built-in dataset from the app/datasets directory.

    Args:
        name: Dataset name (without .csv extension), e.g. 'nsl_kdd_sample'.

    Returns:
        Parsed DataFrame.

    Raises:
        HTTPException: If the dataset does not exist.
    """
    datasets_dir = Path(__file__).parent.parent / "datasets"
    file_path = datasets_dir / f"{name}.csv"
    if not file_path.exists():
        raise HTTPException(status_code=404, detail=f"Built-in dataset '{name}' not found.")
    try:
        return pd.read_csv(file_path)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to load dataset: {str(exc)}")


def save_builtin_as_temp(name: str) -> str:
    """Copy a built-in dataset into the temp store and return a dataset_id.

    This allows built-in datasets to be addressed by the same dataset_id
    mechanism as user-uploaded files.

    Args:
        name: Built-in dataset name.

    Returns:
        dataset_id UUID string.
    """
    df = read_builtin_csv(name)
    dataset_id = str(uuid.uuid4())
    file_path = TEMP_DIR / f"{dataset_id}.csv"
    df.to_csv(file_path, index=False)
    return dataset_id


def cleanup_temp(dataset_id: str) -> bool:
    """Remove a temp file by its dataset_id.

    Args:
        dataset_id: UUID of the dataset to remove.

    Returns:
        True if deleted, False if not found.
    """
    file_path = TEMP_DIR / f"{dataset_id}.csv"
    if file_path.exists():
        file_path.unlink()
        return True
    return False


def list_temp_datasets() -> list[str]:
    """Return all active temp dataset IDs."""
    return [p.stem for p in TEMP_DIR.glob("*.csv")]
