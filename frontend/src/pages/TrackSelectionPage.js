import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchConcepts } from '../services';

function TrackSelectionPage() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchConcepts()
      .then(concepts => {
        // 按 track 分类
        const grouped = {};
        concepts.forEach(c => {
          if (!grouped[c.track]) grouped[c.track] = [];
          grouped[c.track].push(c);
        });
        setTracks(Object.entries(grouped));
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading tracks...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: 600, margin: '40px auto' }}>
      <h1>Select Assessment Track</h1>
      {tracks.map(([track, concepts]) => (
        <div key={track} style={{ marginBottom: 24 }}>
          <h2>{track}</h2>
          <div style={{ display: 'grid', gap: 16 }}>
            {concepts.map(concept => (
              <div
                key={concept._id}
                style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, cursor: 'pointer', background: '#fff', boxShadow: '0 2px 8px #eee' }}
                onClick={() => navigate(`/quiz/${concept._id}`)}
              >
                <h3>{concept.name}</h3>
                <p>{concept.description}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TrackSelectionPage; 