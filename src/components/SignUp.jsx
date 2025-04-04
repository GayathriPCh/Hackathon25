import { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Import the Firestore instance
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirect
import './SignUp.css'; // Import the CSS file

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState(''); // Added field for displayName
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false); // New state for sign up success
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSignUp = async () => {
    setLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Save user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: displayName || '', // Use displayName state, default to empty string
        profilePicture: '', // Optional field, can be updated later
        createdAt: new Date(),
      });

      setSignUpSuccess(true); // Update state on successful sign up
      setTimeout(() => navigate('/signin'), 2000); // Redirect to sign-in page after 2 seconds
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (signUpSuccess) {
    return (
      <div className="signup-success-container">
        <h1>Success!</h1>
        <p>You have successfully signed up. Redirecting you to <a onClick={() => navigate('/signin')}>sign in</a>...</p>
      </div>
    );
  }

  return (
    <div className="signup-container">
      <h1>Sign Up</h1>
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
      <input
        type="text"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        placeholder="Display Name" // Optional field for user name
      />
      <button onClick={handleSignUp} disabled={loading}>
        {loading ? 'Signing Up...' : 'Sign Up'}
      </button>
      <p className="login-link">
        Already have an account? <a onClick={() => navigate('/signin')}>Sign In</a>
      </p>
    </div>
  );
};

export default SignUp;