import { NavLink, useNavigate } from "react-router-dom";
import "./NavBar.css";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import axiosClient from "../../services/axiosClient";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import NotificationDropdown from "./NotificationDropdown";

dayjs.extend(relativeTime);

function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);
  const bellRef = useRef();
  const dropdownRef = useRef();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !bellRef.current.contains(event.target)
      ) {
        setShowNotification(false);
      }
    }
    if (showNotification) {
      document.addEventListener("mousedown", handleClickOutside);
      axiosClient
        .get("/notifications")
        .then((res) => {
          setNotifications(res.data || []);
        })
        .catch(() =>
          setNotifications([], console.error("Error fetching notifications"))
        );
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotification]);

  return (
    <nav className="nav-wrapper">
      <div className="nav-left">
        <NavLink to="/" className="nav-link">
          Home
        </NavLink>
        <NavLink to="/auctions/search" className="nav-link">
          Auction
        </NavLink>
        <NavLink to="/about" className="nav-link">
          Infomation
        </NavLink>
        <NavLink to="/history" className="nav-link">
          History
        </NavLink>
        <NavLink to="/guide" className="nav-link">
          Tutorial
        </NavLink>
        <NavLink to="/contact" className="nav-link">
          Contact
        </NavLink>
        <NavLink to="/policy" className="nav-link">
          Rule
        </NavLink>
        {user?.role === "admin" && (
          <NavLink to="/admin" className="nav-link">
            Dashboard
          </NavLink>
        )}
      </div>
      <div className="nav-right">
        {user ? (
          <>
            <NotificationDropdown triggerRef={bellRef} />
            <span className="user-greeting nav-link">
              Hello {user.role === "admin" ? "admin" : "user"} {user.username}!
            </span>
            <button className="nav-link button-link" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="nav-link">
              Login
            </NavLink>
            <NavLink to="/register" className="nav-link">
              Register
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
