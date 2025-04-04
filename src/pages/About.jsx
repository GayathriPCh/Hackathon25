import React from 'react';
import './About.css'; // Import the CSS file for styling
import '../components/Navbar'
import Navbar from '../components/Navbar';

const About = () => {
  return (
    <div>
          <header className="home-header">
        <Navbar />
      </header>
      <h1>About Our Hospital</h1>

      <div className="content">
        <p>Our hospital is dedicated to providing the best healthcare services to our community.</p>
        <p>We have a team of experienced professionals committed to ensuring the health and well-being of our patients.</p>
        <p>Our facilities are equipped with the latest technology to provide high-quality medical care.</p>
      </div>
    </div>
  );
};

export default About; 