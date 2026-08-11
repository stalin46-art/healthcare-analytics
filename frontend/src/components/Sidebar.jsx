import { HeartPulse, LayoutDashboard, BarChart3, Users, UserPlus, ShieldAlert } from "lucide-react";
import "./Sidebar.css";

function Sidebar({ activeTab, setActiveTab, isOpen, onClose }) {
  const navItems = [
    { id: "overview",     label: "Overview",         icon: LayoutDashboard },
    { id: "analytics",   label: "Analytics & Trends", icon: BarChart3 },
    { id: "patients",    label: "Patient Registry",  icon: Users },
    { id: "add-patient", label: "Add Record",        icon: UserPlus },
  ];

  const handleNav = (id) => {
    setActiveTab(id);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="sidebar-mobile-overlay visible" onClick={onClose} />}

      <aside className={`app-sidebar ${isOpen ? "open" : ""}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="brand-icon-wrapper">
            <HeartPulse size={20} />
          </div>
          <span className="brand-name">MedPulse</span>
          <span className="brand-tag">v3.0</span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="nav-section-title">Main Portal</div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                className={`nav-item ${isActive ? "active" : ""}`}
                onClick={() => handleNav(item.id)}
              >
                <span className="nav-item-icon">
                  <Icon size={17} />
                </span>
                <span className="nav-item-label">{item.label}</span>
              </button>
            );
          })}

          <div className="nav-divider" />
          <div className="nav-section-title">System Insights</div>

          <button
            id="nav-risk-alerts"
            className={`nav-item ${activeTab === "risk-alerts" ? "active" : ""}`}
            onClick={() => handleNav("risk-alerts")}
          >
            <span className="nav-item-icon">
              <ShieldAlert size={17} />
            </span>
            <span className="nav-item-label">High Risk Radar</span>
            <span className="nav-badge" style={{ opacity: activeTab === "risk-alerts" ? 0 : 1 }}>!</span>
          </button>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">DR</div>
            <div>
              <div className="sidebar-user-name">Dr. Alex Vance</div>
              <div className="sidebar-user-role">Lead Clinician</div>
            </div>
          </div>

          <div className="sidebar-status-card">
            <div className="status-pulse-wrapper">
              <div className="status-dot" />
            </div>
            <div>
              <div className="status-text">All Systems Online</div>
              <div className="status-sub">MongoDB · Neural API</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
