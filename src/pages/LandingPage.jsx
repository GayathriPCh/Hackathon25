// src/pages/LandingPage.jsx
import "./LandingPage.css";
import metabg from './Hire3.mp4';

const LandingPage = () => {
  return (
    <div className="landing-page-container">
       {/* Navbar */}
       <nav className="navbar">
        <div className="navbar-links">
          <a href="#home" className="navbar-link">Home</a>
          <a href="#services" className="navbar-link">About</a>
          <a href="#about" className="navbar-link">Tools</a>
          <a href="#contact" className="navbar-link">How-tos</a>
        </div>
      </nav>
      {/* Hero Section */}
      <div className="hero-section">
        <video className="background-video" autoPlay loop muted>
          <source src={metabg} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-content">
        <div className="slogan-box">
            <span className="slogan">Find trust and talent.</span>
          </div>
          <div className="auth-buttons">
            <a href="/signin" className="btn">Sign In</a>
            <a href="/signup" className="btn btn-secondary">Sign Up</a>
          </div>
        </div>
      </div>

      {/* New Section */}
      <div className="new-section">
        <h2>New Section Starts</h2>
      </div>
    </div>
  );
};

export default LandingPage;
