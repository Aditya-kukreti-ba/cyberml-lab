import { useState } from 'react';
import { Database, Settings2, Columns, CheckCircle, Trash2 } from 'lucide-react';
import Card from '../components/common/Card.jsx';
import DatasetUploader from '../components/dataset/DatasetUploader.jsx';
import DatasetPreview from '../components/dataset/DatasetPreview.jsx';
import ColumnSelector from '../components/dataset/ColumnSelector.jsx';
import PreprocessingPanel from '../components/dataset/PreprocessingPanel.jsx';
import { useDataset } from '../hooks/useDataset.js';
import { preprocessDataset } from '../api/client.js';

const STEPS = [
  { id: 'upload',     label: 'Load Dataset',       icon: Database  },
  { id: 'configure',  label: 'Select Columns',      icon: Columns   },
  { id: 'preprocess', label: 'Preprocessing',       icon: Settings2 },
  { id: 'confirm',    label: 'Ready to Train',      icon: CheckCircle },
];

export default function DatasetLab() {
  const dataset = useDataset();
  const [step, setStep] = useState(dataset.datasetId ? 1 : 0);
  const [preprocessResult, setPreprocessResult] = useState(null);
  const [preprocessing, setPreprocessing] = useState(false);
  const [preprocessError, setPreprocessError] = useState(null);

  function handleDatasetLoaded(response) {
    dataset.setDataset(response);
    setStep(1);
  }

  function handleSelectionChange(selection) {
    dataset.setSelection(selection);
  }

  function handlePreprocessChange(config) {
    dataset.setPreprocessingConfig(config);
  }

  async function runPreprocess() {
    if (!dataset.isReady) return;
    setPreprocessing(true);
    setPreprocessError(null);
    try {
      const result = await preprocessDataset({
        dataset_id: dataset.datasetId,
        target_column: dataset.targetColumn,
        feature_columns: dataset.featureColumns,
        ...dataset.preprocessingConfig,
        problem_type: dataset.problemType,
      });
      setPreprocessResult(result);
      setStep(3);
    } catch (e) {
      setPreprocessError(e.message);
    } finally {
      setPreprocessing(false);
    }
  }

  return (
    <div className="page-enter">
      {/* Step indicator */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 'var(--space-8)', position: 'relative' }}>
        {STEPS.map((s, i) => {
          const done = i < step;
          const active = i === step;
          const Icon = s.icon;
          return (
            <div key={s.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)', position: 'relative' }}>
              {i > 0 && (
                <div style={{ position: 'absolute', left: 0, top: 20, width: '50%', height: 2, background: done || active ? 'var(--accent-copper)' : 'var(--border-subtle)' }} />
              )}
              {i < STEPS.length - 1 && (
                <div style={{ position: 'absolute', right: 0, top: 20, width: '50%', height: 2, background: done ? 'var(--accent-copper)' : 'var(--border-subtle)' }} />
              )}
              <div
                style={{
                  width: 40, height: 40, borderRadius: '50%', border: `2px solid ${active ? 'var(--accent-copper)' : done ? 'var(--accent-sage)' : 'var(--border-subtle)'}`,
                  background: active ? 'rgba(184,115,51,0.15)' : done ? 'rgba(143,175,122,0.15)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: active ? 'var(--accent-copper)' : done ? 'var(--accent-sage)' : 'var(--text-muted)',
                  position: 'relative', zIndex: 1,
                }}
              >
                <Icon size={16} />
              </div>
              <span style={{ fontSize: 'var(--text-xs)', color: active ? 'var(--accent-amber)' : done ? 'var(--accent-sage)' : 'var(--text-muted)', fontWeight: active ? 700 : 400, textAlign: 'center' }}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step 0: Upload */}
      {step === 0 && (
        <Card>
          <div className="section-header">
            <h3 className="section-title"><Database size={20} className="section-title-icon" /> Load Dataset</h3>
          </div>
          <DatasetUploader onDatasetLoaded={handleDatasetLoaded} />
        </Card>
      )}

      {/* Steps 1–3: Dataset loaded */}
      {step >= 1 && dataset.datasetInfo && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Dataset preview always visible */}
          <Card>
            <div className="section-header">
              <h3 className="section-title"><Database size={20} className="section-title-icon" /> Dataset Loaded</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => { dataset.clearDataset(); setStep(0); setPreprocessResult(null); }}>
                <Trash2 size={14} /> Change Dataset
              </button>
            </div>
            <DatasetPreview datasetInfo={dataset.datasetInfo} />
          </Card>

          {/* Step 1: Column selection */}
          <Card>
            <div className="section-header">
              <h3 className="section-title"><Columns size={20} className="section-title-icon" /> Configure Columns</h3>
            </div>
            <ColumnSelector
              columnInfo={dataset.datasetInfo.column_info}
              onSelectionChange={handleSelectionChange}
            />
            {dataset.isReady && (
              <div style={{ marginTop: 'var(--space-5)', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" onClick={() => setStep(2)}>
                  Configure Preprocessing →
                </button>
              </div>
            )}
          </Card>

          {/* Step 2: Preprocessing */}
          {step >= 2 && (
            <Card>
              <div className="section-header">
                <h3 className="section-title"><Settings2 size={20} className="section-title-icon" /> Preprocessing</h3>
              </div>
              <PreprocessingPanel onChange={handlePreprocessChange} />
              {preprocessError && (
                <div className="alert alert-danger" style={{ marginTop: 'var(--space-4)' }}>
                  {preprocessError}
                </div>
              )}
              <div style={{ marginTop: 'var(--space-6)', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" onClick={runPreprocess} disabled={preprocessing || !dataset.isReady}>
                  {preprocessing ? 'Processing...' : 'Apply & Preview Split →'}
                </button>
              </div>
            </Card>
          )}

          {/* Step 3: Confirmation */}
          {step >= 3 && preprocessResult && (
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
                <CheckCircle size={22} style={{ color: 'var(--accent-sage)' }} />
                <h3 style={{ margin: 0, color: 'var(--accent-sage)' }}>Dataset Ready for Training</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                {[
                  { label: 'Train Samples', value: preprocessResult.train_samples.toLocaleString(), color: 'var(--accent-sage)' },
                  { label: 'Test Samples',  value: preprocessResult.test_samples.toLocaleString(),  color: 'var(--accent-amber)' },
                  { label: 'Features',      value: preprocessResult.feature_count,                  color: 'var(--accent-purple)' },
                  { label: 'Problem Type',  value: dataset.problemType,                              color: 'var(--accent-copper)' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="metric-card" style={{ padding: 'var(--space-4)' }}>
                    <span className="metric-label">{label}</span>
                    <span className="metric-value" style={{ fontSize: 'var(--text-xl)', color }}>{value}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <a href="/train" className="btn btn-primary">Train a Model →</a>
                <a href="/compare" className="btn btn-secondary">Compare Models →</a>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
