import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { uploadDataset, loadDefaultDataset, listDefaultDatasets } from '../../api/client.js';

export default function DatasetUploader({ onDatasetLoaded }) {
  const [defaults, setDefaults] = useState(null);
  const [loadingDefaults, setLoadingDefaults] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  async function fetchDefaults() {
    if (defaults) return;
    setLoadingDefaults(true);
    try {
      const data = await listDefaultDatasets();
      setDefaults(data);
    } catch (e) {
      setDefaults([]);
    } finally {
      setLoadingDefaults(false);
    }
  }

  async function handleFile(file) {
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
      setError('Only CSV files are accepted.');
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const result = await uploadDataset(file);
      onDatasetLoaded(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleLoadDefault(id) {
    setError(null);
    setUploading(true);
    try {
      const result = await loadDefaultDataset(id);
      onDatasetLoaded(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  }

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? 'var(--accent-copper)' : 'var(--border-default)'}`,
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-10)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-4)',
          cursor: 'pointer',
          transition: 'all var(--transition-base)',
          background: dragging ? 'rgba(184,115,51,0.06)' : 'transparent',
          textAlign: 'center',
        }}
      >
        {uploading ? (
          <Loader2 size={40} style={{ color: 'var(--accent-copper)', animation: 'spin 0.8s linear infinite' }} />
        ) : (
          <Upload size={40} style={{ color: dragging ? 'var(--accent-copper)' : 'var(--text-muted)' }} />
        )}
        <div>
          <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>
            {uploading ? 'Uploading...' : 'Drop your CSV file here'}
          </p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', margin: 0 }}>
            or click to browse — max 50 MB, up to 100,000 rows
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Built-in datasets */}
      <div>
        <div
          className="divider-text"
          style={{ cursor: 'pointer', userSelect: 'none' }}
          onClick={fetchDefaults}
        >
          or use a built-in cybersecurity dataset
        </div>
        {loadingDefaults && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-4)' }}>
            <div className="spinner spinner-sm" />
          </div>
        )}
        {defaults && defaults.map((ds) => (
          <div
            key={ds.id}
            onClick={() => handleLoadDefault(ds.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-4)',
              padding: 'var(--space-4)',
              marginTop: 'var(--space-3)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
            className="glass-card-flat"
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-copper)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
          >
            <FileText size={24} style={{ color: 'var(--accent-copper)', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', margin: 0, fontSize: 'var(--text-sm)' }}>{ds.name}</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: 0 }}>{ds.description}</p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <span className="badge badge-copper">{ds.rows.toLocaleString()} rows</span>
              <br />
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{ds.recommended_target} →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
