import React, { useState, useEffect } from "react";
import NavLink from "./NavLink"
import UserProfile from './UserProfile';
import LogOut from '../../LogOut';

const NavBar = () => {
  const [user, setUser] = useState('');

  let sessionNavLink

  useEffect(() => {
    setUser(UserProfile.getUser())
  }, []);

  if (user.authenticated === false) {
    sessionNavLink = (
      <>
        <li className="nav-item"><NavLink path="/signup" text="Sign Up" /></li>
        <li className="nav-item"><NavLink path="/login" text="Login" /></li>
      </>
    )
  } else {
    sessionNavLink = (
      <>
        <li className="nav-item"><NavLink path="/rooms" text="Book Meeting Room" /></li>
        <li className="nav-item"><NavLink path="/bookings" text="My Bookings" /></li>
        <li className="nav-item"><NavLink path="/me" text="My Profile" /></li>
        <LogOut />
      </>
    )
  }

  window.addEventListener('storage', () => {
    setUser(UserProfile.getUser())
  })

  return (
    <nav className="navbar navbar-expand-lg navbar-light mb-3" style={{ backgroundColor: '#e3f2fd' }}>
      <div className="container-fluid">
        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink path="/" text="Home" />
            </li>
            {sessionNavLink}
          </ul>
        </div>
      </div>
    </nav >
  );
};

export default NavBar;