import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
  timeout: 120000,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor — unwrap data and normalize errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

// ── Dataset APIs ─────────────────────────────────────────────

/** Upload a CSV file; returns UploadResponse with dataset_id. */
export function uploadDataset(file) {
  const form = new FormData();
  form.append('file', file);
  return api.post('/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

/** List all built-in datasets. */
export function listDefaultDatasets() {
  return api.get('/datasets/default');
}

/** Load a built-in dataset by name; returns UploadResponse with dataset_id. */
export function loadDefaultDataset(name) {
  return api.get(`/datasets/default/${name}`);
}

/** Get column metadata for a loaded dataset. */
export function getColumnInfo(datasetId) {
  return api.get('/dataset/columns', { params: { dataset_id: datasetId } });
}

// ── Preprocessing API ────────────────────────────────────────

/**
 * Apply preprocessing and get a preview of the result.
 * @param {object} payload - PreprocessRequest fields
 */
export function preprocessDataset(payload) {
  return api.post('/preprocess', payload);
}

// ── Training API ─────────────────────────────────────────────

/**
 * Train a single model.
 * @param {object} payload - TrainRequest fields
 */
export function trainModel(payload) {
  return api.post('/train', payload);
}

/**
 * Train multiple models side-by-side.
 * @param {object} payload - CompareRequest fields
 */
export function compareModels(payload) {
  return api.post('/compare', payload);
}

export default api;
