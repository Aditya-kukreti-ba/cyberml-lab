from typing import Any, Optional
import numpy as np
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor


class DecisionTreeModel:
    """Wrapper around scikit-learn DecisionTree for the CyberML Lab pipeline."""

    def __init__(
        self,
        problem_type: str = "classification",
        max_depth: Optional[int] = None,
        min_samples_split: int = 2,
        min_samples_leaf: int = 1,
        criterion: str = "gini",
        **kwargs: Any,
    ) -> None:
        self.problem_type = problem_type
        self.max_depth = max_depth
        self.min_samples_split = min_samples_split
        self.min_samples_leaf = min_samples_leaf
        self.criterion = criterion

        if problem_type == "classification":
            self._model = DecisionTreeClassifier(
                max_depth=max_depth,
                min_samples_split=min_samples_split,
                min_samples_leaf=min_samples_leaf,
                criterion=criterion,
            )
        else:
            self._model = DecisionTreeRegressor(
                max_depth=max_depth,
                min_samples_split=min_samples_split,
                min_samples_leaf=min_samples_leaf,
                criterion="squared_error",
            )

    def train(self, X_train: np.ndarray, y_train: np.ndarray) -> None:
        """Fit the tree on training data."""
        self._model.fit(X_train, y_train)

    def predict(self, X: np.ndarray) -> np.ndarray:
        """Return predictions."""
        return self._model.predict(X)

    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        """Return class probabilities (classification only)."""
        if self.problem_type != "classification":
            raise ValueError("predict_proba is only available for classification trees")
        return self._model.predict_proba(X)

    def get_feature_importances(self, feature_names: list[str]) -> dict[str, float]:
        """Return Gini/impurity-based feature importances."""
        importances = self._model.feature_importances_
        return {name: float(imp) for name, imp in zip(feature_names, importances)}

    def get_tree_structure(
        self,
        feature_names: list[str],
        class_names: list[str] | None = None,
        max_depth: int = 4,
    ) -> dict:
        """Export the fitted tree as a nested dict for front-end SVG visualization.

        Each node always includes: leaf, samples, impurity, class_idx, class_label, value.
        Internal nodes additionally include: feature, threshold, left, right.
        Nodes cut off by max_depth are marked truncated=True.
        """
        tree = self._model.tree_

        def _recurse(node_id: int, depth: int) -> dict:
            is_sklearn_leaf = tree.children_left[node_id] == -1
            samples = int(tree.n_node_samples[node_id])
            impurity = round(float(tree.impurity[node_id]), 4)

            # Class distribution / value — available for every node
            raw_value = tree.value[node_id][0]
            value_list = [int(v) for v in raw_value]

            if class_names is not None:
                class_idx = int(raw_value.argmax())
                class_label = str(class_names[class_idx])
            else:
                class_idx = 0
                class_label = str(round(float(raw_value[0]), 4))

            base = {
                "samples": samples,
                "impurity": impurity,
                "class_idx": class_idx,
                "class_label": class_label,
                "value": value_list,
            }

            if is_sklearn_leaf or depth >= max_depth:
                return {**base, "leaf": True, "truncated": not is_sklearn_leaf}

            feature_idx = int(tree.feature[node_id])
            feature = feature_names[feature_idx] if feature_idx < len(feature_names) else f"f{feature_idx}"
            threshold = round(float(tree.threshold[node_id]), 4)

            return {
                **base,
                "leaf": False,
                "truncated": False,
                "feature": feature,
                "threshold": threshold,
                "left": _recurse(tree.children_left[node_id], depth + 1),
                "right": _recurse(tree.children_right[node_id], depth + 1),
            }

        return _recurse(0, 0)

    def get_params(self) -> dict[str, Any]:
        """Return the hyperparameters used for this model instance."""
        return {
            "max_depth": self.max_depth,
            "min_samples_split": self.min_samples_split,
            "min_samples_leaf": self.min_samples_leaf,
            "criterion": self.criterion,
            "problem_type": self.problem_type,
        }

    @property
    def classes_(self) -> np.ndarray:
        if self.problem_type != "classification":
            raise ValueError("classes_ is only available for classification trees")
        return self._model.classes_
