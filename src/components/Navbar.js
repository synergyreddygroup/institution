import React from 'react';
import { Link, useNavigate } from 'react-router-dom';  // Added useNavigate for redirect after logout
import { auth } from '../firebase/firebaseConfig'; // Firebase auth import
import { signOut } from 'firebase/auth'; // Import signOut from Firebase
import '../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate(); // For redirection after logout

  // Handle Logout
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // On success, redirect to login page
        navigate('/login'); // Redirect to login page
        alert('Logout successful!');
      })
      .catch((error) => {
        console.error('Error logging out: ', error);
        alert('Failed to log out. Please try again.');
      });
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>Synergy Reddy Group</h2>
      </div>
      <div className="navbar-links">
        {/* Log out button that calls handleLogout */}
        <button className="navbar-link logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
