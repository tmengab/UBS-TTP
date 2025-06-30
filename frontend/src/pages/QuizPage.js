import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchNextQuestion, submitAnswer } from '../services';

function QuizPage() {
  const userId = localStorage.getItem('userId');
  const { conceptId } = useParams();

  const [question, setQuestion] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [selected, setSelected] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [score, setScore] = useState(0);
  const [materials, setMaterials] = useState([]);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [answerResult, setAnswerResult] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // 加载题目
  useEffect(() => {
    if (!userId) {
      window.location.href = '/login';
      return;
    }
    loadNext();
    // eslint-disable-next-line
  }, [userId, conceptId]);

  async function loadNext() {
    setLoading(true);
    setSelected(undefined);
    setError('');
    setMaterials([]);
    setScore(0);
    setLevelCompleted(false);
    try {
      console.log('Fetching next question for:', { userId, conceptId });
      const data = await fetchNextQuestion(userId, conceptId);
      console.log('fetchNextQuestion data:', data);
      if (!data || !data.question) {
        console.log('No question returned:', data);
        setLevelCompleted(true);
        setScore(data && typeof data.score === 'number' ? data.score : 0);
        setMaterials((data && Array.isArray(data.materials)) ? data.materials : []);
        setLoading(false);
        setQuestion(null);
        setCurrentLevel(data && data.currentLevel ? data.currentLevel : currentLevel);
        return;
      }
      console.log('新题目 id:', data.question && data.question._id);
      setQuestion(data.question);
      setCurrentLevel(data.currentLevel);
      setLoading(false);
    } catch (e) {
      console.error('Error:', e);
      setError('No questions found for this level. Please contact admin or check your question bank.');
      setLoading(false);
    }
  }

  async function handleSubmit() {
    if (selected === undefined) return;
    setLoading(true);
    try {
      const result = await submitAnswer({ userId, questionId: question._id, userAnswer: selected });
      setAnswerResult(result);
      setMaterials(result.materials || []);
      setScore(result.score || 0);
      setShowFeedback(true);
      setLoading(false);
    } catch (e) {
      console.error('submitAnswer error:', e);
      setError(e.message);
      setLoading(false);
    }
  }

  async function handleNextLevel() {
    setLoading(true);
    try {
      // 升级level
      await fetch(`/api/progress/${userId}/${conceptId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newLevel: currentLevel + 1 })
      });
      setCurrentLevel(currentLevel + 1);
      setLevelCompleted(false);
      setScore(0);
      setMaterials([]);
      setQuestion(null);
      setSelected(undefined);
      loadNext();
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }

  async function handleRedoLevel() {
    setLoading(true);
    try {
      // 清空本级
      await fetch(`/api/progress/${userId}/${conceptId}/${currentLevel}`, {
        method: 'DELETE'
      });
      setLevelCompleted(false);
      setScore(0);
      setMaterials([]);
      setQuestion(null);
      setSelected(undefined);
      loadNext();
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }

  if (!userId) return null;
  if (loading) return <div>Loading question...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  if (levelCompleted) {
    return (
      <div className="quiz-card">
        <h2 className="quiz-title">Level {currentLevel} Completed</h2>
        <div style={{ fontSize: 24, margin: '16px 0' }}>Score: {score}</div>
        <div className="quiz-materials">
          <h3>Recommended Materials</h3>
          {(materials || []).length ? (
            <ul>
              {materials.map((m, i) => (
                <li key={i}>
                  <a href={m.url} target="_blank" rel="noopener noreferrer">{m.title}</a> ({m.mediaType})
                </li>
              ))}
            </ul>
          ) : <p>No recommendations. Great job!</p>}
        </div>
        <button onClick={handleRedoLevel} className="quiz-btn" style={{ marginRight: 16 }}>Redo This Level</button>
        <button onClick={handleNextLevel} className="quiz-btn">Enter Next Level</button>
      </div>
    );
  }

  if (!question) return <div>No more questions.</div>;

  return (
    <>
      {showFeedback ? (
        <div className="quiz-card">
          <h2 className="quiz-title">
            {answerResult.isCorrect ? 'Correct!' : 'Incorrect!'}
          </h2>
          <div style={{ fontSize: 24, margin: '16px 0' }}>
            {answerResult.isCorrect
              ? 'Well done!'
              : `The correct answer is: ${question.options[question.correctAnswer]}`}
          </div>
          <div className="quiz-materials">
            <h3>Recommended Materials</h3>
            {(materials || []).length ? (
              <ul>
                {materials.map((m, i) => (
                  <li key={i}>
                    <a href={m.url} target="_blank" rel="noopener noreferrer">{m.title}</a> ({m.mediaType})
                  </li>
                ))}
              </ul>
            ) : <p>No recommendations. Great job!</p>}
          </div>
          {answerResult.isCorrect ? (
            <button
              className="quiz-btn"
              onClick={() => {
                setShowFeedback(false);
                setSelected(undefined);
                setAnswerResult(null);
                loadNext();
              }}
            >
              Next Question
            </button>
          ) : (
            <button
              className="quiz-btn"
              onClick={() => {
                setShowFeedback(false);
                setSelected(undefined);
                setAnswerResult(null);
              }}
            >
              Redo This Question
            </button>
          )}
        </div>
      ) : (
        <div className="quiz-card">
          <h2 className="quiz-title">Quiz - Level {currentLevel}</h2>
          <div className="quiz-question">{question.questionText}</div>
          <div className="quiz-options">
            {question.options.map((opt, i) => (
              <label key={i}>
                <input
                  type="radio"
                  name="option"
                  checked={selected === i}
                  onChange={() => setSelected(i)}
                  style={{ display: 'none' }}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
          <button
            className="quiz-btn"
            disabled={selected === undefined}
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      )}
    </>
  );
}

export default QuizPage;