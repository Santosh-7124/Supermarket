import React from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <header>
      <nav>
        <NavLink
          to="/add"
          className={({ isActive }) => (isActive ? "active-nav-link" : "")}
        >
          Add
        </NavLink>

        <NavLink
          to="/update"
          className={({ isActive }) => (isActive ? "active-nav-link" : "")}
        >
          Update
        </NavLink>

        <NavLink
          to="/delete"
          className={({ isActive }) => (isActive ? "active-nav-link" : "")}
        >
          Delete
        </NavLink>
      </nav>
    </header>
  );
}

export default Navbar;
