from typing import Any
import numpy as np
from sklearn.svm import SVC, SVR


class SVMModel:
    """Wrapper around scikit-learn SVC/SVR for the CyberML Lab pipeline."""

    def __init__(
        self,
        problem_type: str = "classification",
        kernel: str = "rbf",
        C: float = 1.0,
        gamma: str = "scale",
        **kwargs: Any,
    ) -> None:
        self.problem_type = problem_type
        self.kernel = kernel
        self.C = C
        self.gamma = gamma

        if problem_type == "classification":
            self._model = SVC(
                kernel=kernel,
                C=C,
                gamma=gamma,
                probability=True,  # required for predict_proba / ROC
            )
        else:
            self._model = SVR(kernel=kernel, C=C, gamma=gamma)

    def train(self, X_train: np.ndarray, y_train: np.ndarray) -> None:
        """Fit SVC or SVR on training data."""
        self._model.fit(X_train, y_train)

    def predict(self, X: np.ndarray) -> np.ndarray:
        """Return predictions (class labels or continuous values)."""
        return self._model.predict(X)

    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        """Return class probability estimates (classification only)."""
        if self.problem_type != "classification":
            raise ValueError("predict_proba is only available for classification SVMs")
        return self._model.predict_proba(X)

    def get_params(self) -> dict[str, Any]:
        """Return the hyperparameters used for this model instance."""
        return {"kernel": self.kernel, "C": self.C, "gamma": self.gamma, "problem_type": self.problem_type}

    @property
    def classes_(self) -> np.ndarray:
        if self.problem_type != "classification":
            raise ValueError("classes_ is only available for classification SVMs")
        return self._model.classes_
