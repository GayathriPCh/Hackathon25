import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import SignIn from './components/SignIn';
import SignUp from './components/RoleSelection';
import LandingPage from './pages/LandingPage';
import { auth, db } from './firebase';
import About from './pages/About';
import Profile from './components/Profile';
import RoleSelection from './components/RoleSelection';
import HirerSignUp from './components/HirerSignUp';
import SeekerSignUp from './components/SeekerSignUp';
import Interviewer from './components/Interviewer';
import RestrictedProfile from './components/RestrictedProfile';
import { doc, getDoc } from 'firebase/firestore';

function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Helper function to check if user can access regular profile
  const canAccessRegularProfile = () => {
    if (!user || !userData) return false;
    if (userData.role !== 'seeker') return true;
    return userData.interviewCompleted && userData.interviewScore >= 75;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<RoleSelection />} />
        <Route path="/signup/seeker" element={<SeekerSignUp />} />
        <Route path="/signup/hirer" element={<HirerSignUp />} />
        <Route path="/interviewer" element={<Interviewer />} />
        
        {/* Protected Routes */}
        <Route 
          path="/home" 
          element={
            user ? (
              canAccessRegularProfile() ? (
                <Home />
              ) : (
                <Navigate to="/restricted-profile" />
              )
            ) : (
              <Navigate to="/" />
            )
          } 
        />
        
        <Route 
          path="/profile" 
          element={
            user ? (
              canAccessRegularProfile() ? (
                <Profile />
              ) : (
                <Navigate to="/restricted-profile" />
              )
            ) : (
              <Navigate to="/" />
            )
          } 
        />

        <Route 
          path="/restricted-profile" 
          element={
            user ? (
              userData?.role === 'seeker' && (!userData.interviewCompleted || userData.interviewScore < 75) ? (
                <RestrictedProfile />
              ) : (
                <Navigate to="/home" />
              )
            ) : (
              <Navigate to="/" />
            )
          } 
        />

        <Route 
          path="/about" 
          element={
            user ? (
              canAccessRegularProfile() ? (
                <About />
              ) : (
                <Navigate to="/restricted-profile" />
              )
            ) : (
              <Navigate to="/" />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;