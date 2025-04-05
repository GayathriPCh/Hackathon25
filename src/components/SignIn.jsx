// src/components/SignIn.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import './SignIn.css'; // Import the CSS file for styling

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();

      // Check user role and interview status
      if (userData.role === 'seeker') {
        // For job seekers, check interview status
        if (!userData.interviewCompleted || (userData.interviewScore && userData.interviewScore < 75)) {
          navigate('/restricted-profile');
        } else {
          navigate('/home');
        }
      } else {
        // For hirers or other roles, go to home
        navigate('/home');
      }
    } catch (error) {
      setError('Invalid email or password. Please try again.');
      console.error("Error signing in:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <h1>Sign In</h1>
      {error && <p className="error-message">{error}</p>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleSignIn} disabled={loading}>
        {loading ? 'Signing In...' : 'Sign In'}
      </button>
      <p className="signup-link">
        Don't have an account? <a onClick={() => navigate('/signup')}>Sign Up</a>
      </p>
    </div>
  );
};

export default SignIn;