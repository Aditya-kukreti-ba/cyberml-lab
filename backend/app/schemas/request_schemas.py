from typing import Any, Optional
from pydantic import BaseModel, Field


class PreprocessRequest(BaseModel):
    dataset_id: str = Field(..., description="Identifier for the uploaded or default dataset")
    target_column: str = Field(..., description="Column to predict")
    feature_columns: list[str] = Field(..., description="Columns to use as features")
    missing_strategy: str = Field(default="mean", description="How to handle missing values: drop, mean, median, mode")
    encoding_method: str = Field(default="label", description="Categorical encoding: label or onehot")
    scaling_method: str = Field(default="standard", description="Feature scaling: standard, minmax, or none")
    test_size: float = Field(default=0.2, ge=0.1, le=0.5, description="Fraction of data for the test split")
    problem_type: str = Field(..., description="classification or regression")


class TrainRequest(BaseModel):
    dataset_id: str = Field(..., description="Identifier for the dataset to train on")
    target_column: str = Field(..., description="Column to predict")
    feature_columns: list[str] = Field(..., description="Columns to use as features")
    algorithm: str = Field(..., description="Algorithm name: linear_regression, logistic_regression, svm, decision_tree, naive_bayes")
    problem_type: str = Field(..., description="classification or regression")
    hyperparameters: dict[str, Any] = Field(default_factory=dict, description="Algorithm-specific hyperparameters")
    missing_strategy: str = Field(default="mean")
    encoding_method: str = Field(default="label")
    scaling_method: str = Field(default="standard")
    test_size: float = Field(default=0.2, ge=0.1, le=0.5)


class CompareRequest(BaseModel):
    dataset_id: str = Field(..., description="Identifier for the dataset")
    target_column: str = Field(..., description="Column to predict")
    feature_columns: list[str] = Field(..., description="Columns to use as features")
    algorithms: list[str] = Field(..., description="List of algorithm names to compare")
    problem_type: str = Field(..., description="classification or regression")
    hyperparameters: dict[str, dict[str, Any]] = Field(
        default_factory=dict,
        description="Per-algorithm hyperparameters keyed by algorithm name",
    )
    missing_strategy: str = Field(default="mean")
    encoding_method: str = Field(default="label")
    scaling_method: str = Field(default="standard")
    test_size: float = Field(default=0.2, ge=0.1, le=0.5)


class ColumnInfoRequest(BaseModel):
    dataset_id: str = Field(..., description="Identifier for the dataset")
