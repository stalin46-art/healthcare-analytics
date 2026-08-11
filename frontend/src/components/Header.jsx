import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, LogOut, Bell, Menu, Zap } from "lucide-react";
import "./Header.css";

function Header({ onToggleSidebar, user }) {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((p) => (p === "dark" ? "light" : "dark"));
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const getInitials = (name) => {
    if (!name) return "DR";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const userName = user?.name || "Dr. Alex Vance";
  const userInitials = getInitials(userName);

  return (
    <header className="app-header">
      {/* Left */}
      <div className="header-left">
        <button id="sidebar-toggle" className="mobile-toggle-btn" onClick={onToggleSidebar} title="Toggle Navigation">
          <Menu size={18} />
        </button>

        <div className="header-breadcrumb">
          <span className="header-title">MedPulse Analytics</span>
          <span className="header-subtitle">Real-time Clinical Intelligence Platform</span>
        </div>

        <div className="header-live-pill">
          <div className="header-live-dot" />
          Live
        </div>
      </div>

      {/* Right */}
      <div className="header-right">
        {/* Theme toggle */}
        <button id="theme-toggle" className="theme-toggle-btn" onClick={toggleTheme} title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}>
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* System status */}
        <button id="header-status" className="header-icon-btn" title="System Status">
          <Zap size={17} />
        </button>

        {/* Notifications */}
        <button id="header-notifications" className="header-icon-btn" title="Notifications">
          <Bell size={17} />
          <span className="notif-badge" />
        </button>

        <div className="header-sep" />

        {/* User chip */}
        <div className="header-user-chip">
          <div className="user-avatar">{userInitials}</div>
          <div className="user-info">
            <span className="user-name">{userName}</span>
            <span className="user-role">Lead Clinician</span>
          </div>
        </div>

        {/* Logout */}
        <button id="logout-btn" className="logout-btn" onClick={handleLogout} title="Sign Out">
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
