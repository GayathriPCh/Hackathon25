import { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

const HirerSignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (!email || !password || !companyName) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Save company data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        companyName,
        role: 'hirer',
        industry,
        companySize,
        location,
        profileCompleted: true,
        timestamp: new Date()
      });

      setSignUpSuccess(true);
      setTimeout(() => navigate('/signin'), 2000);
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
        <p>Your company account has been created. Redirecting you to <a onClick={() => navigate('/signin')}>sign in</a>...</p>
      </div>
    );
  }

  return (
    <div className="signup-container">
      <h1>Create Company Account</h1>
      {error && <p className="error-message">{error}</p>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Company Email *"
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
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        placeholder="Company Name *"
        required
      />
      <input
        type="text"
        value={industry}
        onChange={(e) => setIndustry(e.target.value)}
        placeholder="Industry"
      />
      <select
        value={companySize}
        onChange={(e) => setCompanySize(e.target.value)}
      >
        <option value="">Select Company Size</option>
        <option value="1-10">1-10 employees</option>
        <option value="11-50">11-50 employees</option>
        <option value="51-200">51-200 employees</option>
        <option value="201-500">201-500 employees</option>
        <option value="501+">501+ employees</option>
      </select>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Company Location"
      />
      <button onClick={handleSignUp} disabled={loading}>
        {loading ? 'Creating Account...' : 'Create Account'}
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

export default HirerSignUp; 