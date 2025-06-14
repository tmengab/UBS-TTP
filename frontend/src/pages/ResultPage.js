import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { history, conceptId } = location.state || {};

  if (!history || !history.length) return <div>No result data.</div>;

  // 计算分数
  let totalWeight = 0;
  let earnedWeight = 0;
  history.forEach(({ question, selected, result }) => {
    const weight = question.level || 1;
    totalWeight += weight;
    if (result.isCorrect) {
      earnedWeight += weight;
    }
  });
  const score = totalWeight ? Math.round((earnedWeight / totalWeight) * 100) : 0;

  // 薄弱知识点和解释
  const weakConcepts = history
    .filter(({ result }) => !result.isCorrect)
    .map(({ question }) => question.conceptName || question.conceptId);
  const explanations = history
    .filter(({ result }) => !result.isCorrect)
    .map(({ result }) => result.explanation);

  // 推荐材料（所有答错题目的材料合并去重）
  const allMaterials = history
    .filter(({ result }) => result.materials && result.materials.length > 0)
    .flatMap(({ result }) => result.materials);
  const uniqueMaterials = Array.from(new Map(allMaterials.map(m => [m.url, m])).values());

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
      <h3>Recommended Learning Materials</h3>
      {uniqueMaterials.length ? (
        <ul>
          {uniqueMaterials.map((m, i) => (
            <li key={i}>
              <a href={m.url} target="_blank" rel="noopener noreferrer">{m.title}</a> ({m.mediaType})
            </li>
          ))}
        </ul>
      ) : <p>No recommendations. Great job!</p>}
      <button style={{ marginTop: 24 }} onClick={() => navigate('/')}>Back to Home</button>
    </div>
  );
}

export default ResultPage; 