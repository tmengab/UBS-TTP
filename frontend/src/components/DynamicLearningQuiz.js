import React, { useState, useEffect } from 'react';

export default function DynamicLearningQuiz({ trackId, onClose, onComplete }) {
  const [track, setTrack] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (trackId) {
      loadTrack();
    }
  }, [trackId]);

  const loadTrack = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/chatbot/learning-track/${trackId}?userId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setTrack(data.data);
        // Find the first unanswered question
        const firstUnanswered = data.data.questions.findIndex(q => !q.answered);
        setCurrentQuestionIndex(firstUnanswered >= 0 ? firstUnanswered : 0);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Failed to load learning track');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (selectedAnswer === null) return;

    try {
      const response = await fetch(`/api/chatbot/answer-question?userId=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackId,
          questionIndex: currentQuestionIndex,
          userAnswer: selectedAnswer
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data);
        setShowResult(true);
        
        // Update the track with new data
        setTrack(prev => ({
          ...prev,
          score: data.score,
          questions: prev.questions.map((q, i) => 
            i === currentQuestionIndex 
              ? { ...q, userAnswer: selectedAnswer, isCorrect: data.isCorrect, answered: true }
              : q
          )
        }));
      } else {
        setError(data.error || 'Failed to submit answer');
      }
    } catch (error) {
      console.error('Submit answer error:', error);
      setError('Failed to submit answer');
    }
  };

  const nextQuestion = () => {
    setShowResult(false);
    setSelectedAnswer(null);
    setResult(null);
    
    if (result.completed) {
      onComplete(track);
    } else {
      setCurrentQuestionIndex(result.nextQuestionIndex);
    }
  };

  const currentQuestion = track?.questions[currentQuestionIndex];

  if (loading) {
    return (
      <div className="dynamic-learning-quiz" style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        maxWidth: '600px',
        margin: '20px auto',
        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.15)'
      }}>
        <div style={{ textAlign: 'center' }}>Loading quiz...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dynamic-learning-quiz" style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        maxWidth: '600px',
        margin: '20px auto',
        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.15)'
      }}>
        <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>
        <button 
          onClick={onClose}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            cursor: 'pointer',
            marginTop: '16px'
          }}
        >
          Close
        </button>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="dynamic-learning-quiz" style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        maxWidth: '600px',
        margin: '20px auto',
        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.15)'
      }}>
        <h3 style={{ color: '#667eea', marginTop: 0 }}>Quiz Complete!</h3>
        <p>You've answered all questions for "{track.topic}".</p>
        <p>Final Score: {track.score}/{track.totalQuestions}</p>
        <button 
          onClick={() => onComplete(track)}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            cursor: 'pointer',
            marginRight: '8px'
          }}
        >
          View Results
        </button>
        <button 
          onClick={onClose}
          style={{
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            cursor: 'pointer'
          }}
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="dynamic-learning-quiz" style={{
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      maxWidth: '600px',
      margin: '20px auto',
      boxShadow: '0 10px 30px rgba(102, 126, 234, 0.15)'
    }}>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ color: '#667eea', marginTop: 0 }}>{track.topic}</h3>
        <p style={{ color: '#6c757d', margin: '8px 0' }}>
          Question {currentQuestionIndex + 1} of {track.totalQuestions}
        </p>
        <div style={{ 
          background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
          height: '4px',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            height: '100%',
            width: `${((currentQuestionIndex + 1) / track.totalQuestions) * 100}%`,
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {!showResult ? (
        <>
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ color: '#495057', marginBottom: '16px' }}>
              {currentQuestion.questionText}
            </h4>
            <div>
              {currentQuestion.options.map((option, index) => (
                <label
                  key={index}
                  style={{
                    display: 'block',
                    padding: '12px 16px',
                    margin: '8px 0',
                    border: `2px solid ${selectedAnswer === index ? '#667eea' : '#e9ecef'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: selectedAnswer === index ? 'rgba(102, 126, 234, 0.1)' : 'white'
                  }}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={index}
                    checked={selectedAnswer === index}
                    onChange={() => setSelectedAnswer(index)}
                    style={{ marginRight: '8px' }}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
          <button
            onClick={submitAnswer}
            disabled={selectedAnswer === null}
            style={{
              background: selectedAnswer === null 
                ? '#6c757d' 
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              cursor: selectedAnswer === null ? 'not-allowed' : 'pointer',
              fontSize: '16px'
            }}
          >
            Submit Answer
          </button>
        </>
      ) : (
        <>
          <div style={{
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '16px',
            background: result.isCorrect 
              ? 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)'
              : 'linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)',
            border: `1px solid ${result.isCorrect ? '#c3e6cb' : '#f5c6cb'}`
          }}>
            <h4 style={{ 
              color: result.isCorrect ? '#155724' : '#721c24',
              marginTop: 0
            }}>
              {result.isCorrect ? '✅ Correct!' : '❌ Incorrect'}
            </h4>
            <p style={{ 
              color: result.isCorrect ? '#155724' : '#721c24',
              margin: '8px 0'
            }}>
              {result.explanation}
            </p>
            <p style={{ 
              color: result.isCorrect ? '#155724' : '#721c24',
              margin: '8px 0',
              fontWeight: 'bold'
            }}>
              Score: {result.score}/{result.totalQuestions}
            </p>
          </div>
          <button
            onClick={nextQuestion}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            {result.completed ? 'View Results' : 'Next Question'}
          </button>
        </>
      )}
    </div>
  );
} 