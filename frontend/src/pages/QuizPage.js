import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchNextQuestion, submitAnswer } from '../services';

function QuizPage() {
  const { track: conceptId } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem('token') || 'guest'; // 实际项目应用真实 userId
  const [question, setQuestion] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [selected, setSelected] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]); // {question, selected, result}
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    loadNext();
    // eslint-disable-next-line
  }, []);

  async function loadNext() {
    setLoading(true);
    setSelected(undefined);
    setShowExplanation(false);
    setExplanation('');
    setIsCorrect(null);
    setMaterials([]);
    try {
      const data = await fetchNextQuestion(userId, conceptId);
      if (!data || !data.question) {
        // 跳转到结果页，带上历史答题记录
        navigate('/result', { state: { history, conceptId } });
        return;
      }
      setQuestion(data.question);
      setCurrentLevel(data.currentLevel);
      setLoading(false);
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }

  async function handleSubmit() {
    if (selected === undefined) return;
    setLoading(true);
    try {
      const res = await submitAnswer({ userId, questionId: question._id, userAnswer: selected });
      setShowExplanation(true);
      setExplanation(res.explanation);
      setIsCorrect(res.isCorrect);
      setMaterials(res.materials || []);
      setHistory(prev => [...prev, { question, selected, result: res }]);
      setLoading(false);
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }

  function handleNext() {
    loadNext();
  }

  if (loading) return <div>Loading question...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!question) return <div>No more questions.</div>;

  return (
    <div style={{ maxWidth: 600, margin: '40px auto' }}>
      <h2>Quiz</h2>
      <div style={{ margin: '24px 0' }}>
        <h3>{question.questionText}</h3>
        {question.options.map((opt, i) => (
          <div key={i} style={{ margin: '8px 0' }}>
            <label>
              <input
                type="radio"
                name="option"
                checked={selected === i}
                onChange={() => setSelected(i)}
                disabled={showExplanation}
              />{' '}
              {opt}
            </label>
          </div>
        ))}
      </div>
      {!showExplanation ? (
        <button
          className="btn"
          style={{ padding: '8px 24px', background: '#3498db', color: '#fff', border: 'none', borderRadius: 4 }}
          disabled={selected === undefined}
          onClick={handleSubmit}
        >
          Submit
        </button>
      ) : (
        <div>
          <div style={{ margin: '16px 0', color: isCorrect ? 'green' : 'red' }}>
            {isCorrect ? 'Correct!' : 'Incorrect.'}
          </div>
          <div style={{ marginBottom: 12 }}><b>Explanation:</b> {explanation}</div>
          {materials.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <b>Recommended Materials:</b>
              <ul>
                {materials.map((m, idx) => (
                  <li key={idx}>
                    <a href={m.url} target="_blank" rel="noopener noreferrer">{m.title}</a> ({m.mediaType})
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button onClick={handleNext}>Next Question</button>
        </div>
      )}
    </div>
  );
}

export default QuizPage; 