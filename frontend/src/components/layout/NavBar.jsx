import { NavLink, useNavigate } from "react-router-dom";
import "./NavBar.css";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import axiosClient from "../../services/axiosClient";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import NotificationDropdown from "./NotificationDropdown";
import { useTranslation } from "react-i18next";

dayjs.extend(relativeTime);

function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);
  const bellRef = useRef();
  const dropdownRef = useRef();
  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Khi load trang, ưu tiên lấy ngôn ngữ từ sessionStorage nếu có
  useEffect(() => {
    const savedLang = sessionStorage.getItem("lang");
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

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
          {t("home", "Home")}
        </NavLink>
        <NavLink to="/auctions/search" className="nav-link">
          {t("auction", "Auction")}
        </NavLink>
        <NavLink to="/about" className="nav-link">
          {t("information", "Information")}
        </NavLink>
        <NavLink to="/history" className="nav-link">
          {t("history", "History")}
        </NavLink>
        <NavLink to="/guide" className="nav-link">
          {t("tutorial", "Tutorial")}
        </NavLink>
        <NavLink to="/contact" className="nav-link">
          {t("contact", "Contact")}
        </NavLink>
        <NavLink to="/policy" className="nav-link">
          {t("rule", "Rule")}
        </NavLink>
        {user?.role === "admin" && (
          <NavLink to="/admin" className="nav-link">
            {t("dashboard", "Dashboard")}
          </NavLink>
        )}
      </div>
      <div className="nav-right">
        {user ? (
          <>
            <NotificationDropdown triggerRef={bellRef} />
            <span className="user-greeting nav-link">Account Infomation</span>
            <button className="nav-link button-link" onClick={handleLogout}>
              {t("logout", "Logout")}
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="nav-link">
              {t("login", "Đăng nhập")}
            </NavLink>
            <NavLink to="/register" className="nav-link">
              {t("register", "Register")}
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
