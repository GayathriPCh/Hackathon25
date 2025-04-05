import { useNavigate } from 'react-router-dom';
import './RoleSelection.css';

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="role-selection-container">
      <h1>Choose Your Account Type</h1>
      <div className="role-buttons">
        <button 
          className="role-button hirer"
          onClick={() => navigate('/signup/hirer')}
        >
          <h2>I'm a Company Hirer</h2>
          <p>Post jobs and find talented candidates</p>
        </button>
        
        <button 
          className="role-button seeker"
          onClick={() => navigate('/signup/seeker')}
        >
          <h2>I'm a Job Seeker</h2>
          <p>Find your dream job and connect with employers</p>
        </button>
      </div>
    </div>
  );
};

export default RoleSelection; 