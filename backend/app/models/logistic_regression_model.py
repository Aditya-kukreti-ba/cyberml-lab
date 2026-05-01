from typing import Any, Optional
import numpy as np
from sklearn.linear_model import LogisticRegression


class LogisticRegressionModel:
    """Wrapper around scikit-learn LogisticRegression for the CyberML Lab pipeline."""

    def __init__(
        self,
        C: float = 1.0,
        max_iter: int = 1000,
        solver: str = "lbfgs",
        multi_class: str = "auto",
        **kwargs: Any,
    ) -> None:
        self.C = C
        self.max_iter = max_iter
        self.solver = solver
        self.multi_class = multi_class
        self._model = LogisticRegression(
            C=C,
            max_iter=max_iter,
            solver=solver,
            multi_class=multi_class,
        )

    def train(self, X_train: np.ndarray, y_train: np.ndarray) -> None:
        """Fit the classifier on training data."""
        self._model.fit(X_train, y_train)

    def predict(self, X: np.ndarray) -> np.ndarray:
        """Return class label predictions."""
        return self._model.predict(X)

    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        """Return class probability estimates (used for ROC curves)."""
        return self._model.predict_proba(X)

    def get_params(self) -> dict[str, Any]:
        """Return the hyperparameters used for this model instance."""
        return {"C": self.C, "max_iter": self.max_iter, "solver": self.solver}

    def get_feature_importances(self, feature_names: list[str]) -> Optional[dict[str, float]]:
        """Return absolute coefficient magnitudes as feature importance proxy."""
        coefs = np.abs(self._model.coef_[0])
        total = coefs.sum() or 1.0
        return {name: float(coef / total) for name, coef in zip(feature_names, coefs)}

    @property
    def classes_(self) -> np.ndarray:
        return self._model.classes_
