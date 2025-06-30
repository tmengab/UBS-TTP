import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import TrackSelectionPage from './pages/TrackSelectionPage';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import HistoryPage from './pages/HistoryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TrackSelectPage from "./pages/TrackSelectPage";
import TrackPage from "./pages/TrackPage";
import ConceptDetailPage from "./pages/ConceptDetailPage";
import ChatbotWidget from "./components/ChatbotWidget";
import RankingPage from './pages/RankingPage';

// 这是一个小的辅助组件，因为 useNavigate 只能在 Router 内部使用
function HomeButton() {
    const navigate = useNavigate();
    return (
        <button
            onClick={() => navigate('/dashboard')}
            style={{
                position: 'fixed',
                top: 24,
                left: 32,
                zIndex: 9999,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: 48,
                height: 48,
                fontSize: '24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
            }}
            onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
            }}
            title="Go to Dashboard"
        >
            🏠
        </button>
    );
}

function App() {
  return (
    <div>
      <div
        style={{
          width: '100%',
          background: 'transparent',
          fontSize: '2.5rem',
          fontWeight: 700,
          textAlign: 'center',
          marginTop: '32px',
          marginBottom: '24px',
          letterSpacing: '1px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: 'none'
        }}
      >
        Welcome to Women Tech Learning Platform!
      </div>
      <ChatbotWidget />
      <Router>
        <HomeButton />
        <Routes>
          <Route path="/" element={<TrackSelectionPage />} />
          <Route path="/quiz/:conceptId" element={<QuizPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<TrackSelectPage />} />
          <Route path="/track/:trackKey" element={<TrackPage />} />
          <Route path="/concept/:conceptId" element={<ConceptDetailPage />} />
          <Route path="/ranking" element={<RankingPage />} />
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;