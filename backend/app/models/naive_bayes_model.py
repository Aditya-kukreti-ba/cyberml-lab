from typing import Any
import numpy as np
from sklearn.naive_bayes import GaussianNB


class NaiveBayesModel:
    """Wrapper around scikit-learn GaussianNB for the CyberML Lab pipeline."""

    def __init__(self, var_smoothing: float = 1e-9, **kwargs: Any) -> None:
        self.var_smoothing = var_smoothing
        self._model = GaussianNB(var_smoothing=var_smoothing)

    def train(self, X_train: np.ndarray, y_train: np.ndarray) -> None:
        """Fit GaussianNB on training data."""
        self._model.fit(X_train, y_train)

    def predict(self, X: np.ndarray) -> np.ndarray:
        """Return class label predictions."""
        return self._model.predict(X)

    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        """Return class probability estimates (used for ROC curves)."""
        return self._model.predict_proba(X)

    def get_params(self) -> dict[str, Any]:
        """Return the hyperparameters used for this model instance."""
        return {"var_smoothing": self.var_smoothing}

    @property
    def classes_(self) -> np.ndarray:
        return self._model.classes_
