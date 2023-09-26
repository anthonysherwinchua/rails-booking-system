import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavLink from "./NavLink"
import Confirm from './Confirm';
import UserProfile from './UserProfile';

const NavBar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const logout = () => {
    const url = `/api/logout`;

    fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": user.jti,
      },
    })
      .then(res => {
        handleResponse(res, (r) => {
          if (r.status == 'error') {
            const errorMessages = r.data.map((message, key) => (
              <Error key={key} message={message} />
            ));
            setErrorMessage(errorMessages);
          } else {
            navigate(`/`);
          }
        })
      })
      .catch((e) => {
        setErrorMessage('Something went wrong. <br/>Error Message: ' + e);
      })
      .finally(() => {
        UserProfile.removeUser()
        navigate(`/`);
      });
  };

  let sessionNavLink

  useEffect(() => {
    setUser(UserProfile.getUser())
  }, []);

  if (user['name'] === undefined) {
    sessionNavLink = (
      <>
        <li className="nav-item"><NavLink path="/signup" text="Sign Up" /></li>
        <li className="nav-item"><NavLink path="/login" text="Login" /></li>
      </>
    )
  } else {
    sessionNavLink = (
      <>
        <li className="nav-item"><NavLink path="/me" text="My Profile" /></li>
        <li className="nav-item">
          <Link className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#confirmModal">
            Logout
          </Link>
          <Confirm modalID="confirmModal" title={"Log out"} message="Are you sure?" confirm="Logout!" cancel="No" onConfirm={logout} />
        </li>
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