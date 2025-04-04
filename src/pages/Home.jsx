import Navbar from '../components/Navbar'; // Adjust the import path as needed
import './Home.css';

const Home = () => {
  return (
    <div>
      <header className="home-header">
        <Navbar />
      </header>
      <div className="content">
        <h1>Welcome to Home Page</h1>
      </div>
    </div>
  );
};

export default Home;