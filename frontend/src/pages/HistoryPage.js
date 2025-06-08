import React from 'react';

const mockHistory = [
  { id: '1', track: 'basicProgramming', score: 80, date: '2024-05-01' },
  { id: '2', track: 'fullStack', score: 90, date: '2024-05-02' },
];

function HistoryPage() {
  return (
    <div style={{ maxWidth: 600, margin: '40px auto' }}>
      <h2>Assessment History</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #ddd', padding: 8 }}>Track</th>
            <th style={{ borderBottom: '1px solid #ddd', padding: 8 }}>Score</th>
            <th style={{ borderBottom: '1px solid #ddd', padding: 8 }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {mockHistory.map(h => (
            <tr key={h.id}>
              <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>{h.track}</td>
              <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>{h.score}</td>
              <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>{h.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HistoryPage; 