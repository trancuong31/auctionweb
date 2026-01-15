import { NavLink, useNavigate } from "react-router-dom";
import "./NavBar.css";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import axiosClient from "../../services/axiosClient";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import NotificationDropdown from "./NotificationDropdown";
import AuctionHistory from "./AuctionHistory";
import { useTranslation } from "react-i18next";
import AccountInfo from "./AccountInfo";
dayjs.extend(relativeTime);

function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);
  const [showAccountInfo, setShowAccountInfo] = useState(false);
  const [showAuctionHistory, setShowAuctionHistory] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  const bellRef = useRef();
  const dropdownRef = useRef();
  const { t, i18n } = useTranslation();

  // Detect mobile screen
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  useEffect(() => {
    const savedLang = sessionStorage.getItem("lang");
    i18n.changeLanguage(savedLang);
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
    <>
      {/* Mobile Header Bar */}
      <div className="mobile-header">
        <button 
          className="hamburger-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
        <div className="mobile-header-right">
          {user ? (
            <>
              {isMobile && <NotificationDropdown triggerRef={bellRef} />}
              <span
                className="nav-link"
                onClick={() => setShowAccountInfo(true)}
                style={{ cursor: "pointer" }}
              >
                {t("account_info")}
              </span>
            </>
          ) : (
            <>
              <NavLink to="/login" className="mobile-auth-btn mobile-auth-filled">
                {t("login", "Đăng nhập")}
              </NavLink>
              <NavLink to="/register" className="mobile-auth-btn mobile-auth-outline">
                {t("register", "Đăng ký")}
              </NavLink>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && <div className="mobile-menu-backdrop" onClick={closeMobileMenu}></div>}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <img src="/src/assets/images/logo.png" alt="Logo" className="mobile-menu-logo" />
          <button className="mobile-menu-close" onClick={closeMobileMenu}>×</button>
        </div>
        <div className="mobile-menu-nav">
          <NavLink to="/" className="mobile-nav-link" onClick={closeMobileMenu}>
            {t("home", "Trang chủ")}
          </NavLink>
          <NavLink to="/guide" className="mobile-nav-link" onClick={closeMobileMenu}>
            {t("tutorial", "Hướng dẫn")}
          </NavLink>
          <NavLink to="/contact" className="mobile-nav-link" onClick={closeMobileMenu}>
            {t("contact", "Liên hệ")}
          </NavLink>
          <NavLink to="/about" className="mobile-nav-link" onClick={closeMobileMenu}>
            {t("information", "Giới thiệu")}
          </NavLink>
          <NavLink to="/auctions/search" className="mobile-nav-link" onClick={closeMobileMenu}>
            {t("auction", "Đấu giá")}
          </NavLink>
          <NavLink to="/history" className="mobile-nav-link" onClick={closeMobileMenu}>
            {t("history", "Lịch sử")}
          </NavLink>
          <NavLink to="/policy" className="mobile-nav-link" onClick={closeMobileMenu}>
            {t("rule", "Quy định")}
          </NavLink>
          {(user?.role === "admin" || user?.role === "super_admin") && (
            <NavLink to="/admin" className="mobile-nav-link" onClick={closeMobileMenu}>
              {t("dashboard", "Dashboard")}
            </NavLink>
          )}
          {user && (
            <>
              <span
                className="mobile-nav-link"
                onClick={() => { setShowAccountInfo(true); closeMobileMenu(); }}
              >
                {t("account_info", "Thông tin tài khoản")}
              </span>
              {user?.role === "user" && (
                <span
                  className="mobile-nav-link"
                  onClick={() => { setShowAuctionHistory(true); closeMobileMenu(); }}
                >
                  {t("auction_history", "Lịch sử đấu giá")}
                </span>
              )}
              <span
                className="mobile-nav-link"
                onClick={() => { handleLogout(); closeMobileMenu(); }}
              >
                {t("logout", "Đăng xuất")}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Desktop Nav - hidden on mobile */}
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
          {(user?.role === "admin" || user?.role === "super_admin") && (
            <NavLink to="/admin" className="nav-link">
              {t("dashboard", "Dashboard")}
            </NavLink>
          )}
        </div>
        <div className="nav-right">
          {user ? (
            <>
              {/* Bell icon for desktop - only render when not mobile */}
              {!isMobile && <NotificationDropdown triggerRef={bellRef} />}
              <span
                className="user-greeting nav-link"
                onClick={() => setShowAccountInfo(true)}
                style={{ cursor: "pointer" }}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") &&
                  setShowAccountInfo(true)
                }
                aria-label={t("account_info")}
                role="button"
              >
                {t("account_info")}
              </span>

              {user?.role === "user" && (
                <span
                  className="nav-link"
                  onClick={() => setShowAuctionHistory(true)}
                  style={{ cursor: "pointer" }}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") &&
                    setShowAuctionHistory(true)
                  }
                  aria-label={t("auction_history")}
                  role="button"
                >
                  {t("auction_history")}
                </span>
              )}

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
      <AccountInfo
        isOpen={showAccountInfo}
        onClose={() => setShowAccountInfo(false)}
      />
      <AuctionHistory
        isOpen={showAuctionHistory}
        onClose={() => setShowAuctionHistory(false)}
      />
    </>
  );
}

export default NavBar;
