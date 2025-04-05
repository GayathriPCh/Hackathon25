import { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { generateInterviewQuestions } from '../utils/groqService';
import './SeekerSignup.css';

const SeekerSignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState('form'); // 'form', 'generating', 'preview'
  const [generatedQuestions, setGeneratedQuestions] = useState([]);

  const navigate = useNavigate();

  const handlePreviewQuestions = async () => {
    if (!email || !password || !name || !skills) {
      setError('Please fill in all required fields');
      return;
    }

    setCurrentStep('generating');
    setError('');

    try {
      // Convert skills string to array and clean it up
      const skillsArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill);
      
      // Generate interview questions based on input
      const questions = await generateInterviewQuestions(
        skillsArray,
        experience || '0'
      );

      setGeneratedQuestions(questions);
      setCurrentStep('preview');
    } catch {
      setError('Error generating questions. Please try again.');
      setCurrentStep('form');
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    setError('');
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Save user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        name,
        role: 'seeker',
        skills: skills.split(',').map(skill => skill.trim()).filter(skill => skill),
        experience,
        location,
        profileCompleted: false,
        interviewCompleted: false,
        generatedQuestions, // Save the generated questions
        timestamp: new Date()
      });

      // Navigate to interviewer with the generated questions
      navigate('/interviewer', { 
        state: { 
          userId: user.uid,
          questions: generatedQuestions
        } 
      });
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  if (currentStep === 'generating') {
    return (
      <div className="signup-container">
        <div className="loading">
          <h2>Analyzing your skills and preparing interview questions...</h2>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (currentStep === 'preview') {
    return (
      <div className="signup-container">
        <h1>Preview Your Interview Questions</h1>
        <p className="subtitle">These questions will help verify your expertise in the skills you've listed.</p>
        
        <div className="questions-preview">
          {generatedQuestions.map((q, index) => (
            <div key={index} className="question-preview-card">
              <div className="skill-tag">{q.skill}</div>
              <p>{q.question}</p>
            </div>
          ))}
        </div>

        <div className="preview-actions">
          <button className="secondary" onClick={() => setCurrentStep('form')}>
            Go Back
          </button>
          <button onClick={handleSignUp} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account & Start Interview'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-container">
      <h1>Create Job Seeker Account</h1>
      {error && <p className="error-message">{error}</p>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email *"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password *"
        required
      />
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Full Name *"
        required
      />
      <input
        type="text"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
        placeholder="Skills (comma-separated) *"
        required
      />
      <input
        type="text"
        value={experience}
        onChange={(e) => setExperience(e.target.value)}
        placeholder="Years of Experience"
      />
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location"
      />
      <button onClick={handlePreviewQuestions} disabled={loading}>
        Preview Interview Questions
      </button>
      <p className="login-link">
        Already have an account? <a onClick={() => navigate('/signin')}>Sign In</a>
      </p>
      <p className="back-link">
        <a onClick={() => navigate('/signup')}>← Back to account type selection</a>
      </p>
    </div>
  );
};

export default SeekerSignUp; 