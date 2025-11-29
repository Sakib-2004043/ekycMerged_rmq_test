import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './navBar.css';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState(null);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    // Get user info from localStorage or location state
    const email = localStorage.getItem('email') || location.state?.email;
    const type = localStorage.getItem('userType');
    
    setUserEmail(email);
    setUserType(type);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('userType');
    setUserEmail(null);
    setUserType(null);
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">eKYC Portal</Link>
      </div>
      
      <ul className="navbar-links">
        <li>
          <Link to="/" className={isActive('/')}>Home</Link>
        </li>
        
        {!userEmail ? (
          // Not logged in - Show Sign Up and Login
          <>
            <li>
              <Link to="/signup" className={isActive('/signup')}>Sign Up</Link>
            </li>
            <li>
              <Link to="/login" className={isActive('/login')}>Login</Link>
            </li>
          </>
        ) : (
          // Logged in - Show Dashboard and Logout
          <>
            {userType === 'admin' && (
              <li>
                <Link to="/admin" className={isActive('/admin')}>Dashboard</Link>
              </li>
            )}
            {userType === 'user' && (
              <li>
                <Link to="/user" className={isActive('/user')}>Dashboard</Link>
              </li>
            )}
            <li>
              <div className="user-info">
                <span className="user-email">{userEmail}</span>
              </div>
            </li>
            <li>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
