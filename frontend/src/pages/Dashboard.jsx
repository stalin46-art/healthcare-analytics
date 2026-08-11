import { useEffect, useState } from "react";
import API from "../services/api";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import PatientTable from "../components/PatientTable";
import PatientForm from "../components/PatientForm";
import Analytics from "../components/Analytics";
import DashboardCharts from "../components/DashboardCharts";

import {
  Users, AlertTriangle, Activity, Heart, ShieldAlert,
  LayoutDashboard, BarChart3, UserPlus, Stethoscope
} from "lucide-react";
import "./Dashboard.css";

function Dashboard() {
  const [patients, setPatients]       = useState([]);
  const [user, setUser]               = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [activeTab, setActiveTab]     = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const loadUser = async () => {
    try {
      const res = await API.get("/auth/me");
      if (res.data) {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  };

  const loadPatients = async () => {
    try {
      const res = await API.get("/patients");
      setPatients(res.data || []);
    } catch (error) {
      console.error("Error loading patients:", error);
    }
  };

  useEffect(() => {
    loadUser();
    loadPatients();
  }, []);

  const totalPatients = patients.length;
  const highRiskCount = patients.filter((p) => p.prediction === "High Risk").length;
  const avgGlucose    = totalPatients
    ? (patients.reduce((s, p) => s + (Number(p.glucose) || 0), 0) / totalPatients).toFixed(1) : 0;
  const avgBmi        = totalPatients
    ? (patients.reduce((s, p) => s + (Number(p.bmi) || 0), 0) / totalPatients).toFixed(1) : 0;

  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 18 ? "Good afternoon" : "Good evening";
  const userDisplayName = user?.name ? (user.name.startsWith("Dr.") ? user.name : `Dr. ${user.name}`) : "Dr. Vance";

  const tabs = [
    { id: "overview",     label: "Overview",    icon: LayoutDashboard },
    { id: "analytics",   label: "Analytics",    icon: BarChart3 },
    { id: "patients",    label: "Patients",     icon: Users },
    { id: "add-patient", label: "Add Record",   icon: UserPlus },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="dashboard-main">
        <Header onToggleSidebar={() => setSidebarOpen((p) => !p)} user={user} />

        <div className="dashboard-content">

          {/* Welcome Banner */}
          {activeTab === "overview" && (
            <div className="welcome-banner animate-fade-in">
              <div className="welcome-text">
                <h2>{greeting}, {userDisplayName} 👋</h2>
                <p>Here's your clinical intelligence summary for today.</p>
                <div className="welcome-time">
                  {now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </div>
              </div>
              <Stethoscope size={64} color="rgba(255,255,255,0.2)" />
            </div>
          )}

          {/* KPI Cards */}
          <div className="dashboard-kpi-grid">
            <StatCard title="Total Patients"     value={totalPatients}          icon={Users}         color="blue"   subtext="Registered in registry"              trend={{ type: "positive", value: "+12%" }} />
            <StatCard title="High Risk Alerts"   value={highRiskCount}          icon={AlertTriangle} color="red"    subtext="Requires immediate review"           trend={{ type: "negative", value: `${highRiskCount} active` }} />
            <StatCard title="Avg Glucose"        value={`${avgGlucose} mg/dL`}  icon={Activity}      color="purple" subtext="Target: 70–140 mg/dL" />
            <StatCard title="Avg BMI Index"      value={avgBmi}                 icon={Heart}         color="green"  subtext="Healthy: 18.5–24.9" />
          </div>

          {/* High Risk Banner */}
          {highRiskCount > 0 && activeTab === "overview" && (
            <div className="risk-alert-banner">
              <div className="risk-alert-info">
                <div className="risk-alert-icon-wrap">
                  <ShieldAlert size={22} />
                </div>
                <div>
                  <h4>⚠ High Risk Patients Flagged — {highRiskCount} detected</h4>
                  <p>AI model detected elevated health risk metrics. Immediate clinical review recommended.</p>
                </div>
              </div>
              <button className="view-radar-btn" onClick={() => setActiveTab("risk-alerts")}>
                View Risk Radar →
              </button>
            </div>
          )}

          {/* Tab Bar */}
          <div className="quick-tabs-bar">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                id={`tab-${id}`}
                className={`quick-tab-btn ${activeTab === id ? "active" : ""}`}
                onClick={() => setActiveTab(id)}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <>
              <DashboardCharts />
              <PatientTable patients={patients} refresh={loadPatients} />
            </>
          )}

          {activeTab === "analytics" && (
            <>
              <Analytics patients={patients} />
              <DashboardCharts />
            </>
          )}

          {activeTab === "patients" && (
            <PatientTable patients={patients} refresh={loadPatients} />
          )}

          {activeTab === "add-patient" && (
            <PatientForm refresh={loadPatients} />
          )}

          {activeTab === "risk-alerts" && (
            <PatientTable
              patients={patients.filter((p) => p.prediction === "High Risk")}
              refresh={loadPatients}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;