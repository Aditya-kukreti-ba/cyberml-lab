import { useState } from 'react';
import { Cpu, AlertCircle, Play } from 'lucide-react';
import Card from '../components/common/Card.jsx';
import Loader from '../components/common/Loader.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import AlgorithmSelector from '../components/training/AlgorithmSelector.jsx';
import TrainingControls from '../components/training/TrainingControls.jsx';
import TrainingResults from '../components/training/TrainingResults.jsx';
import { useDataset } from '../hooks/useDataset.js';
import { trainModel } from '../api/client.js';

export default function ModelTraining() {
  const dataset = useDataset();
  const [selectedAlgo, setSelectedAlgo] = useState('');
  const [hyperparameters, setHyperparameters] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleTrain() {
    if (!dataset.isReady || !selectedAlgo) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await trainModel({
        dataset_id: dataset.datasetId,
        target_column: dataset.targetColumn,
        feature_columns: dataset.featureColumns,
        algorithm: selectedAlgo,
        problem_type: dataset.problemType,
        hyperparameters,
        ...dataset.preprocessingConfig,
      });
      setResult(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (!dataset.isReady) {
    return (
      <div className="page-enter">
        <EmptyState
          icon={Cpu}
          title="No Dataset Configured"
          description="Go to Dataset Lab first to load a dataset and configure your target column and features."
          actionLabel="Open Dataset Lab"
          actionTo="/dataset"
        />
      </div>
    );
  }

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div className="training-grid">
        {/* Left panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', minWidth: 0 }}>
          {/* Dataset summary */}
          <Card flat>
            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-3)' }}>
              Active Dataset
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {[
                { label: 'Target', value: dataset.targetColumn, color: 'var(--accent-copper)' },
                { label: 'Features', value: `${dataset.featureColumns.length} columns`, color: 'var(--accent-sage)' },
                { label: 'Problem', value: dataset.problemType, color: 'var(--accent-amber)' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{label}</span>
                  <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color, fontWeight: 600 }}>{value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Algorithm selection */}
          <Card>
            <h4 style={{ marginBottom: 'var(--space-4)' }}>Select Algorithm</h4>
            <AlgorithmSelector
              problemType={dataset.problemType}
              selected={selectedAlgo}
              onSelect={setSelectedAlgo}
            />
          </Card>

          {/* Hyperparameters */}
          {selectedAlgo && (
            <Card>
              <h4 style={{ marginBottom: 'var(--space-4)' }}>Hyperparameters</h4>
              <TrainingControls
                algorithm={selectedAlgo}
                onChange={setHyperparameters}
              />
            </Card>
          )}

          {/* Train button */}
          <button
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
            onClick={handleTrain}
            disabled={!selectedAlgo || loading}
          >
            {loading ? (
              <><div className="spinner spinner-sm" /> Training...</>
            ) : (
              <><Play size={18} /> Train Model</>
            )}
          </button>
        </div>

        {/* Right panel: results */}
        <div style={{ minWidth: 0 }}>
          {loading && <Loader message={`Training ${selectedAlgo?.replace(/_/g, ' ')}...`} size="lg" />}
          {error && (
            <div className="alert alert-danger">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
          {!loading && !error && !result && (
            <EmptyState
              icon={Cpu}
              title="Results will appear here"
              description="Select an algorithm and click Train Model to see metrics, confusion matrix, and charts."
            />
          )}
          {!loading && result && (
            <Card>
              <TrainingResults result={result} />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
