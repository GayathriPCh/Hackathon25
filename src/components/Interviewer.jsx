import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './Interviewer.css';

const Interviewer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(null);
  const userId = location.state?.userId;
  const questions = useMemo(() => location.state?.questions || [], [location.state]);

  useEffect(() => {
    if (!userId || !questions.length) {
      navigate('/signup');
    }
  }, [userId, questions, navigate]);

  const calculateScore = (answers) => {
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    return (correctAnswers / questions.length) * 100;
  };

  const handleAnswer = async () => {
    if (!selectedOption) {
      return; // Don't proceed if no option is selected
    }

    const currentQ = questions[currentQuestion];
    const isCorrect = selectedOption === currentQ.correctAnswer;
    
    const newAnswers = [...answers, {
      skill: currentQ.skill,
      question: currentQ.question,
      selectedAnswer: selectedOption,
      correctAnswer: currentQ.correctAnswer,
      isCorrect
    }];

    setAnswers(newAnswers);
    setShowExplanation(true);

    // Wait 3 seconds to show explanation before moving to next question
    setTimeout(() => {
      setShowExplanation(false);
      setSelectedOption('');

      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        finishInterview(newAnswers);
      }
    }, 3000);
  };

  const finishInterview = async (finalAnswers) => {
    setLoading(true);
    const finalScore = calculateScore(finalAnswers);
    setScore(finalScore);

    try {
      // Update user profile in Firestore
      await updateDoc(doc(db, 'users', userId), {
        interviewAnswers: finalAnswers,
        interviewScore: finalScore,
        interviewCompleted: true,
        profileCompleted: finalScore >= 75,
        lastInterviewDate: new Date()
      });
      setCompleted(true);
      
      // Redirect based on score
      setTimeout(() => {
        if (finalScore >= 75) {
          navigate('/signin');
        }
        // Do nothing on fail – let the user stay and see options like "Try Again"
      }, 3000);
      
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (completed) {
    return (
      <div className="interviewer-container success">
        <h1>{score >= 75 ? '🎉 Congratulations!' : '📚 Keep Learning!'}</h1>
        <div className="score-display">
          <div className="score-circle">
            <span className="score-number">{Math.round(score)}%</span>
          </div>
        </div>
        {score >= 75 ? (
          <>
            <p>You've successfully completed the interview with a passing score.</p>
            <p>Redirecting you to sign in...</p>
          </>
        ) : (
          <>
            <p>Your score indicates that you might need more practice in some areas.</p>
            <p>Consider:</p>
            <ul>
              <li>Updating your skills through online courses</li>
              <li>Getting more hands-on experience</li>
              <li>Trying the interview again after preparation</li>
            </ul>
            <div className="action-buttons">
              <button onClick={() => navigate('/signup/seeker')}>Update Skills</button>
              <button onClick={() => navigate('/interview')}>Try Again</button>
            </div>
          </>
        )}
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="interviewer-container">
        <h1>Error</h1>
        <p>No questions found. Please try signing up again.</p>
        <button onClick={() => navigate('/signup')}>Back to Sign Up</button>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="interviewer-container">
      <div className="progress-bar">
        <div 
          className="progress" 
          style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
        ></div>
      </div>
      
      <h1>Technical Skills Assessment</h1>
      <p className="subtitle">
        Choose the best answer for each question
      </p>

      <div className="question-card">
        <h2>Question {currentQuestion + 1} of {questions.length}</h2>
        <div className="skill-tag">{currentQ.skill}</div>
        <p className="question">{currentQ.question}</p>
        
        <div className="options-container">
          {Object.entries(currentQ.options).map(([key, value]) => (
            <label key={key} className={`option-label ${selectedOption === key ? 'selected' : ''}`}>
              <input
                type="radio"
                name="answer"
                value={key}
                checked={selectedOption === key}
                onChange={(e) => setSelectedOption(e.target.value)}
                disabled={showExplanation}
              />
              <span className="option-text">
                <strong>{key}:</strong> {value}
              </span>
            </label>
          ))}
        </div>

        {showExplanation && (
          <div className={`explanation ${selectedOption === currentQ.correctAnswer ? 'correct' : 'incorrect'}`}>
            <p>
              <strong>
                {selectedOption === currentQ.correctAnswer ? '✓ Correct!' : '✗ Incorrect!'}
              </strong>
            </p>
            <p>{currentQ.explanation}</p>
          </div>
        )}

        <button 
          onClick={handleAnswer}
          disabled={loading || !selectedOption || showExplanation}
        >
          {loading ? 'Processing...' : showExplanation ? 'Next Question...' : 'Submit Answer'}
        </button>
      </div>

      <p className="skills-list">
        Skills being verified: {questions.map(q => q.skill).filter((v, i, a) => a.indexOf(v) === i).join(', ')}
      </p>
    </div>
  );
};

export default Interviewer; 