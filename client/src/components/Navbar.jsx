import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">Exam Management</Link>
        <div className="navbar-menu">
          {user ? (
            <>
              <span className="navbar-user">{user.name} ({user.role})</span>
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
};