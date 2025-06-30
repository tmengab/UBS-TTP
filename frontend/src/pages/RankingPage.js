import React, { useEffect, useState } from 'react';

export default function RankingPage() {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    fetch('/api/progress/ranking')
      .then(res => res.json())
      .then(data => setRanking(data.data || []));
  }, []);

  return (
    <div className="user-ranking" style={{ margin: '40px auto', maxWidth: 600, background: '#fff', borderRadius: 16, padding: 24 }}>
      <h3 style={{ color: '#667eea', marginTop: 0 }}>User Ranking</h3>
      <ol>
        {ranking.map((user, idx) => (
          <li key={user.userId}>
            {user.username || user.userId}: {user.totalScore}
          </li>
        ))}
      </ol>
    </div>
  );
}
