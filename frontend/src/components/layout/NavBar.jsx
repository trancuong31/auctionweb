import { NavLink } from "react-router-dom";
import "./NavBar.css";

function NavBar() {
  return (
    <nav className="nav-wrapper">
      <div className="nav-left">
        <NavLink to="/" className="nav-link">Home</NavLink>
        <NavLink to="/auctions" className="nav-link">Auction</NavLink>
        <NavLink to="/news" className="nav-link">News</NavLink>
        <NavLink to="/about" className="nav-link">Infomation</NavLink>
        <NavLink to="/history" className="nav-link">History</NavLink>
        <NavLink to="/contact" className="nav-link">Contact</NavLink>
        <NavLink to="/guide" className="nav-link">Tutorial</NavLink>
        <NavLink to="/policy" className="nav-link">Rule</NavLink>
      </div>
      <div className="nav-right">
        <NavLink to="/login" className="nav-link">Login</NavLink>
        <NavLink to="/register" className="nav-link">Register</NavLink>
      </div>
    </nav>
  );
}

export default NavBar;