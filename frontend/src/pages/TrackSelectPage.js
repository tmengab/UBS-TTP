import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import LearningSummary from '../components/LearningSummary';

export default function TrackSelectPage() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const userId = localStorage.getItem('userId');
  const [news, setNews] = useState('');

  useEffect(() => {
    if (userId) {
      fetch(`/api/progress/summary/${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setSummary(data.data);
          }
        })
        .catch(err => console.error("Failed to fetch learning summary:", err));
    }
  }, [userId]);

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => setNews(data.news))
      .catch(() => setNews('Failed to load news.'));
  }, []);

  const tracks = [
    { key: 'basic', name: 'Basic Programming', description: 'Test your fundamental programming skills including syntax, logic, and control structures' },
    { key: 'data-structures', name: 'Data Structures', description: 'Test your understanding and application of data structures (arrays, linked lists, trees, graphs, etc.)' },
    { key: 'full-stack', name: 'Full-stack Development', description: 'Evaluate your frontend and backend development skills including HTML/CSS, JavaScript, frameworks and databases' },
    { key: 'data-science', name: 'Data Science', description: 'Evaluate your data analysis, statistics, machine learning, and data processing skills' },
    { key: 'ai-learning', name: 'AI Learning', description: 'Explore concepts in Artificial Intelligence, from basic algorithms to neural networks.' }
  ];

  const handleSelectTrack = (trackKey) => {
    navigate(`/track/${trackKey}`);
  };

  return (
    <div className="track-selection-page">
      <div
        className="learning-summary"
        style={{
          background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
          color: '#1976d2',
          fontWeight: 500,
          margin: '32px auto 24px auto',
        }}
      >
        <h3 style={{ color: '#667eea', marginTop: 0 }}>Latest Tech News</h3>
        <div style={{ whiteSpace: 'pre-line' }}>{news}</div>
      </div>

      <LearningSummary summary={summary} />
      
      <h2 className="page-title" style={{ 
        textAlign: 'center', 
        marginTop: '40px',
        marginBottom: '30px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontSize: '2.5rem',
        fontWeight: '700'
      }}>
        Choose Your Learning Track
      </h2>

      <div className="tracks-container" style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '2rem',
        padding: '0 2rem'
      }}>
        {tracks.map((track, index) => (
          <div 
            key={track.key} 
            className="track-card" 
            onClick={() => handleSelectTrack(track.key)}
            style={{
              flexBasis: 'calc(45% - 1rem)',
              minWidth: '300px',
              flexGrow: 1,
              maxWidth: '450px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <h3 style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '12px',
              fontSize: '1.4rem',
              fontWeight: '600'
            }}>{track.name}</h3>
            <p style={{
              color: '#6c757d',
              lineHeight: '1.6',
              marginBottom: '20px'
            }}>{track.description}</p>
            <button className="btn" style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '10px 20px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
            }}>Start Learning</button>
          </div>
        ))}
      </div>

      <button
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: 12,
          padding: '10px 24px',
          fontWeight: 600,
          cursor: 'pointer',
          margin: '24px 0'
        }}
        onClick={() => navigate('/ranking')}
      >
        View User Ranking
      </button>
    </div>
  );
}
