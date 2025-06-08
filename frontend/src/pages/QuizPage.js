import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Mock backend-aligned question bank
const questionBank = {
  basicProgramming: [
    {
      conceptName: 'Loops',
      level: 1,
      questionText: 'Which loop structure guarantees at least one execution?',
      options: ['for loop', 'while loop', 'do-while loop', 'forEach loop'],
      correctAnswer: 2,
      explanation: 'do-while executes the code block once before checking the condition.'
    },
    {
      conceptName: 'Conditionals',
      level: 1,
      questionText: "Which operator checks equality without type coercion?",
      options: ['==', '===', '=', '!='],
      correctAnswer: 1,
      explanation: '=== checks value and type.'
    }
  ],
  fullStack: [
    {
      conceptName: 'Frontend',
      level: 1,
      questionText: 'Which HTML tag is used to create a hyperlink?',
      options: ['<a>', '<link>', '<url>', '<href>'],
      correctAnswer: 0,
      explanation: 'The <a> tag defines a hyperlink.'
    }
  ],
  dataStructures: [
    {
      conceptName: 'Stack',
      level: 1,
      questionText: 'What is the characteristic of a stack?',
      options: ['FIFO', 'LIFO', 'FILO', 'LILO'],
      correctAnswer: 1,
      explanation: 'Stack is Last-In-First-Out.'
    }
  ],
  dataScience: [
    {
      conceptName: 'Pandas',
      level: 1,
      questionText: 'Which function is used to read a CSV file in pandas?',
      options: ['read_csv', 'load_csv', 'import_csv', 'open_csv'],
      correctAnswer: 0,
      explanation: 'read_csv() is the correct function.'
    }
  ]
};

function QuizPage() {
  const { track } = useParams();
  const navigate = useNavigate();
  const questions = questionBank[track] || [];
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);

  if (!questions.length) return <div>No questions available for this track.</div>;

  const handleSelect = idx => {
    setAnswers(prev => {
      const next = [...prev];
      next[current] = idx;
      return next;
    });
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
    } else {
      navigate('/result', { state: { track, answers, questions } });
    }
  };

  const q = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div style={{ maxWidth: 600, margin: '40px auto' }}>
      <h2>Quiz - {track}</h2>
      <div style={{ height: 8, background: '#eee', borderRadius: 4, margin: '16px 0' }}>
        <div style={{ width: `${progress}%`, height: 8, background: '#3498db', borderRadius: 4 }} />
      </div>
      <div style={{ margin: '24px 0' }}>
        <h3>Q{current + 1}: {q.questionText}</h3>
        {q.options.map((opt, i) => (
          <div key={i} style={{ margin: '8px 0' }}>
            <label>
              <input
                type="radio"
                name="option"
                checked={answers[current] === i}
                onChange={() => handleSelect(i)}
              />{' '}
              {opt}
            </label>
          </div>
        ))}
      </div>
      <button
        className="btn"
        style={{ padding: '8px 24px', background: '#3498db', color: '#fff', border: 'none', borderRadius: 4 }}
        disabled={answers[current] === undefined}
        onClick={handleNext}
      >
        {current === questions.length - 1 ? 'Submit' : 'Next'}
      </button>
    </div>
  );
}

export default QuizPage; 