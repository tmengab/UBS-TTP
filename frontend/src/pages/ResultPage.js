import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// mock weak concepts and videos
const mockConcepts = [
  { name: 'Loops', difficulty: 'Beginner' },
  { name: 'Variable Declaration', difficulty: 'Beginner' },
];
const mockVideos = [
  { title: 'JavaScript Loops Explained', url: 'https://youtube.com/loop', channel: 'Frontend Classroom', duration: '10:21' },
  { title: 'Variables and Scope', url: 'https://youtube.com/var', channel: 'Programming Basics', duration: '8:45' },
];

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { track, answers, questions } = location.state || {};

  if (!questions || !answers) return <div>No result data.</div>;

  // Calculate weighted score
  let totalWeight = 0;
  let earnedWeight = 0;
  questions.forEach((q, i) => {
    const weight = q.level;
    totalWeight += weight;
    if (answers[i] === q.correctAnswer) {
      earnedWeight += weight;
    }
  });
  const score = totalWeight ? Math.round((earnedWeight / totalWeight) * 100) : 0;

  // Find weak concepts and explanations
  const weakConcepts = questions
    .map((q, i) => (answers[i] !== q.correctAnswer ? q.conceptName : null))
    .filter(Boolean);
  const explanations = questions
    .map((q, i) => (answers[i] !== q.correctAnswer ? q.explanation : null))
    .filter(Boolean);

  return (
    <div style={{ maxWidth: 600, margin: '40px auto' }}>
      <h2>Assessment Result</h2>
      <div style={{ fontSize: 24, margin: '16px 0' }}>Score: {score}</div>
      <h3>Weak Concepts</h3>
      {weakConcepts.length ? (
        <ul>
          {weakConcepts.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      ) : (
        <p>No weak concepts! Excellent work.</p>
      )}
      <h3>Explanations for Incorrect Answers</h3>
      {explanations.length ? (
        <ul>
          {explanations.map((e, i) => (
            <li key={i}>{e}</li>
          ))}
        </ul>
      ) : null}
      <button style={{ marginTop: 24 }} onClick={() => navigate('/')}>Back to Home</button>
    </div>
  );
}

export default ResultPage; 