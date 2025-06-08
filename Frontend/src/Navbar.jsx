import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header style={{ padding: "20px", border: "1px solid #121212" }}>
      <nav style={{ display: "flex", gap: "40px" }}>
        <Link to="/add">Add</Link>
        <Link to="/update">Update</Link>
        <Link to="/delete">Delete</Link>
      </nav>
    </header>
  );
}

export default Navbar;
