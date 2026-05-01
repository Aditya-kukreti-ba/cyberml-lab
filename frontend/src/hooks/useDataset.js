import { useState, useCallback } from 'react';

const STORAGE_KEY = 'cyberml_dataset_state';

function loadPersisted() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persist(state) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Shared dataset state hook.
 * Stores dataset_id, column info, selection, and preprocessing config
 * so all pages can access the current dataset without re-uploading.
 */
export function useDataset() {
  const [state, setState] = useState(() => {
    const persisted = loadPersisted();
    return persisted || {
      datasetId: null,
      datasetInfo: null,
      targetColumn: '',
      featureColumns: [],
      problemType: 'classification',
      preprocessingConfig: {
        missing_strategy: 'mean',
        encoding_method: 'label',
        scaling_method: 'standard',
        test_size: 0.2,
      },
    };
  });

  const setDataset = useCallback((uploadResponse) => {
    const next = {
      ...state,
      datasetId: uploadResponse.dataset_id,
      datasetInfo: uploadResponse.dataset_info,
      targetColumn: '',
      featureColumns: [],
    };
    setState(next);
    persist(next);
  }, [state]);

  const setSelection = useCallback(({ targetColumn, featureColumns, problemType }) => {
    const next = { ...state, targetColumn, featureColumns, problemType };
    setState(next);
    persist(next);
  }, [state]);

  const setPreprocessingConfig = useCallback((config) => {
    const next = { ...state, preprocessingConfig: config };
    setState(next);
    persist(next);
  }, [state]);

  const clearDataset = useCallback(() => {
    const next = {
      datasetId: null,
      datasetInfo: null,
      targetColumn: '',
      featureColumns: [],
      problemType: 'classification',
      preprocessingConfig: {
        missing_strategy: 'mean',
        encoding_method: 'label',
        scaling_method: 'standard',
        test_size: 0.2,
      },
    };
    setState(next);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const isReady = Boolean(state.datasetId && state.targetColumn && state.featureColumns.length > 0);

  return {
    ...state,
    setDataset,
    setSelection,
    setPreprocessingConfig,
    clearDataset,
    isReady,
  };
}
