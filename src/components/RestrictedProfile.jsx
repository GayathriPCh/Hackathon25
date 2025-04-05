import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import './RestrictedProfile.css';

const RestrictedProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div className="restricted-profile-container">Loading...</div>;
  }

  if (!userData) {
    return <div className="restricted-profile-container">No user data found.</div>;
  }

  const lastScore = userData.interviewScore || 0;

  return (
    <div className="restricted-profile-container">
      <div className="profile-section">
        <h1>Welcome, {userData.name}</h1>
        <div className="score-info">
          <h2>Interview Status</h2>
          <div className="score-display">
            <div className="score-circle">
              <span className="score-number">{Math.round(lastScore)}%</span>
            </div>
          </div>
          <p className="score-message">
            Your current score is below the required 75% threshold.
          </p>
        </div>
      </div>

      <div className="skills-section">
        <h2>Your Current Skills</h2>
        <div className="skills-list">
          {userData.skills.map((skill, index) => (
            <span key={index} className="skill-tag">{skill}</span>
          ))}
        </div>
      </div>

      <div className="action-section">
        <h2>Next Steps</h2>
        <div className="action-cards">
          <div className="action-card">
            <h3>Update Your Skills</h3>
            <p>Enhance your profile by adding new skills or updating existing ones.</p>
            <button onClick={() => navigate('/signup/seeker')}>Update Skills</button>
          </div>
          <div className="action-card">
            <h3>Try Interview Again</h3>
            <p>Ready to demonstrate your expertise? Take the interview again.</p>
            <button onClick={() => navigate('/interviewer')}>Start Interview</button>
          </div>
        </div>
      </div>

      <div className="resources-section">
        <h2>Learning Resources</h2>
        <div className="resource-cards">
          <div className="resource-card">
            <h3>Online Courses</h3>
            <ul>
              <li><a href="https://www.coursera.org" target="_blank" rel="noopener noreferrer">Coursera</a></li>
              <li><a href="https://www.udemy.com" target="_blank" rel="noopener noreferrer">Udemy</a></li>
              <li><a href="https://www.edx.org" target="_blank" rel="noopener noreferrer">edX</a></li>
            </ul>
          </div>
          <div className="resource-card">
            <h3>Practice Platforms</h3>
            <ul>
              <li><a href="https://www.hackerrank.com" target="_blank" rel="noopener noreferrer">HackerRank</a></li>
              <li><a href="https://leetcode.com" target="_blank" rel="noopener noreferrer">LeetCode</a></li>
              <li><a href="https://www.codewars.com" target="_blank" rel="noopener noreferrer">CodeWars</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestrictedProfile; 