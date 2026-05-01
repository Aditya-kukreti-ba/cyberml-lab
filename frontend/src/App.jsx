import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import LandingPage from './pages/LandingPage.jsx';
import AlgorithmOverview from './pages/AlgorithmOverview.jsx';
import DatasetLab from './pages/DatasetLab.jsx';
import ModelTraining from './pages/ModelTraining.jsx';
import ComparisonDashboard from './pages/ComparisonDashboard.jsx';
import VisualExplanations from './pages/VisualExplanations.jsx';
import CyberScenarios from './pages/CyberScenarios.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<Layout />}>
          <Route path="/algorithms" element={<AlgorithmOverview />} />
          <Route path="/dataset" element={<DatasetLab />} />
          <Route path="/train" element={<ModelTraining />} />
          <Route path="/compare" element={<ComparisonDashboard />} />
          <Route path="/visuals" element={<VisualExplanations />} />
          <Route path="/scenarios" element={<CyberScenarios />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
