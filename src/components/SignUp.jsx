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
  const [location, setLocation] = useState(''); // State for location
  const [name, setName] = useState(''); // State for name
  const [bio, setBio] = useState(''); // State for bio
  const [skills, setSkills] = useState(''); // State for skills
  const [experience, setExperience] = useState(''); // State for experience
  const [role, setRole] = useState(''); // State for role
  const navigate = useNavigate(); // Initialize useNavigate hook

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
        displayName: displayName || '',
        role: '', // will be filled in complete profile step
        name: '',
        bio: '',
        skills: [],
        experience: '',
        location: '',
        profileCompleted: false,
        timestamp: new Date()
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
      <input
  type="text"
  value={name}
  onChange={(e) => setName(e.target.value)}
  placeholder="Full Name"
/>

<textarea
  value={bio}
  onChange={(e) => setBio(e.target.value)}
  placeholder="Short Bio (optional)"
></textarea>

<input
  type="text"
  value={skills}
  onChange={(e) => setSkills(e.target.value)}
  placeholder="Skills (comma-separated)"
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

<select value={role} onChange={(e) => setRole(e.target.value)}>
  <option value="">Select Role</option>
  <option value="seeker">Job Seeker</option>
  <option value="employer">Employer</option>
</select>

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