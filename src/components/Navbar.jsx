import { Link } from "react-router-dom";
import "./Navbar.css"; // Assuming you have styles

const Navbar = () => {
  return (
    <nav className="nav-links">
      <Link to="/home" className="nav-button">Dashboard</Link>
      <Link to="/about" className="nav-button">Updates</Link>
      <Link to="/tools" className="nav-button">Tools</Link>
      <Link to="/features" className="nav-button">Tutorials</Link>
    </nav>
  );
};

export default Navbar;