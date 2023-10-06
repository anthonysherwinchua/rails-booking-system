import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom'

interface NavLinkProps {
  path: string;
  text: string;
}

const NavLink = ({ path, text }: NavLinkProps) => {
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