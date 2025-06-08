import React from 'react';
import { useNavigate } from 'react-router-dom';

const tracks = [
  { key: 'basicProgramming', name: 'Basic Programming', desc: 'Test your understanding of loops, conditionals, functions, data types, and variables.' },
  { key: 'fullStack', name: 'Full Stack', desc: 'Assess your knowledge of frontend, backend, and database concepts.' },
  { key: 'dataStructures', name: 'Data Structures', desc: 'Evaluate your skills in arrays, linked lists, trees, graphs, and more.' },
  { key: 'dataScience', name: 'Data Science', desc: 'Test your knowledge in data analysis, statistics, and machine learning.' },
];

function TrackSelectionPage() {
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: 600, margin: '40px auto' }}>
      <h1>Select Assessment Track</h1>
      <div style={{ display: 'grid', gap: 24 }}>
        {tracks.map(track => (
          <div
            key={track.key}
            style={{ border: '1px solid #ddd', borderRadius: 8, padding: 24, cursor: 'pointer', background: '#fff', boxShadow: '0 2px 8px #eee' }}
            onClick={() => navigate(`/quiz/${track.key}`)}
          >
            <h2>{track.name}</h2>
            <p>{track.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrackSelectionPage; 