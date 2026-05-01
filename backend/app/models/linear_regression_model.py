from typing import Any
import numpy as np
from sklearn.linear_model import LinearRegression


class LinearRegressionModel:
    """Wrapper around scikit-learn LinearRegression for the CyberML Lab pipeline."""

    def __init__(self, fit_intercept: bool = True, **kwargs: Any) -> None:
        self.fit_intercept = fit_intercept
        self._model = LinearRegression(fit_intercept=fit_intercept)

    def train(self, X_train: np.ndarray, y_train: np.ndarray) -> None:
        """Fit the model on training data."""
        self._model.fit(X_train, y_train)

    def predict(self, X: np.ndarray) -> np.ndarray:
        """Return continuous predictions."""
        return self._model.predict(X)

    def get_params(self) -> dict[str, Any]:
        """Return the hyperparameters used for this model instance."""
        return {"fit_intercept": self.fit_intercept}

    def get_feature_importances(self, feature_names: list[str]) -> dict[str, float]:
        """Return absolute coefficient values as a proxy for feature importance."""
        coefs = np.abs(self._model.coef_)
        total = coefs.sum() or 1.0
        return {name: float(coef / total) for name, coef in zip(feature_names, coefs)}
