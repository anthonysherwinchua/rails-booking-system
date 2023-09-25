import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom'

const NavLink = ({ path, text }) => {
  function isActive() {
    return (useLocation().pathname == path) ? 'active' : '';
  }

  return (
    <Link to={path} className={"nav-link " + isActive()}>
      {text}
    </Link >
  );
};

export default NavLink;