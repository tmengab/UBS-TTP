import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TrackSelectionPage from './pages/TrackSelectionPage';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import HistoryPage from './pages/HistoryPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TrackSelectionPage />} />
        <Route path="/quiz/:track" element={<QuizPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;