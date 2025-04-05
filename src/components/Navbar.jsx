import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import "./Navbar.css";

const Navbar = () => {
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setDisplayName(docSnap.data().displayName);
        }
      }
    });

    return () => unsubscribe(); // Cleanup
  }, []);

  return (
    <nav className="navbar-container">
      <Link to="/profile" className="profile-link">
        <span role="img" aria-label="profile">👤</span> {displayName}
      </Link>
    </nav>
  );
};

export default Navbar;
