import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import LandingPage from './pages/LandingPage';
import { auth } from './firebase';
import About from './pages/About';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false); // Update loading state when user is checked
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Optionally add a loading indicator
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        {/* Protecting the routes based on user's authentication state */}
        <Route path="/home" element={user ? <Home /> : <Navigate to="/" />} />
                <Route path="/about" element={user ? <About /> : <Navigate to="/" />} />
                

        {/* Add more routes here */}
      </Routes>
    </Router>
  );
}

export default App;