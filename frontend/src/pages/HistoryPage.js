import React, { useEffect, useState } from 'react';
import { fetchUserProgress } from '../services';

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId') || 'guest';

  useEffect(() => {
    fetchUserProgress(userId)
      .then(data => {
        setHistory(data);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <div>Loading history...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: 600, margin: '40px auto' }}>
      <h2>Assessment History</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #ddd', padding: 8 }}>Concept</th>
            <th style={{ borderBottom: '1px solid #ddd', padding: 8 }}>Level</th>
            <th style={{ borderBottom: '1px solid #ddd', padding: 8 }}>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {history.map(h => (
            <tr key={h._id}>
              <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>{h.concept?.name || h.conceptId}</td>
              <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>{h.currentLevel}</td>
              <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>{new Date(h.lastUpdated).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HistoryPage; 