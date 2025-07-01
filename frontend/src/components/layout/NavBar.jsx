import { NavLink } from "react-router-dom";
import "./NavBar.css";
import { useAuth } from "../../contexts/AuthContext";
function NavBar() {
  const {user, logout} = useAuth();
  return (
    <nav className="nav-wrapper">
      <div className="nav-left">
        <NavLink to="/" className="nav-link">Home</NavLink>
        <NavLink to="/auctions/search" className="nav-link">Auction</NavLink>
        <NavLink to="/about" className="nav-link">Infomation</NavLink>
        <NavLink to="/history" className="nav-link">History</NavLink>
        <NavLink to="/contact" className="nav-link">Contact</NavLink>
        <NavLink to="/guide" className="nav-link">Tutorial</NavLink>
        <NavLink to="/policy" className="nav-link">Rule</NavLink>
      </div>
      <div className="nav-right">
        {user ? (
          <>
            <span className="user-greeting nav-link ">
            Hello {user.role === "admin" ? "admin" : "user"} {user.username}!
            </span>
            <button className="nav-link button-link" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="nav-link">Login</NavLink>
            <NavLink to="/register" className="nav-link">Register</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;