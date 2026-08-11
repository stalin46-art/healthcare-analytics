import { useEffect, useState } from "react";
import API from "../services/api";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  LineChart, Line, CartesianGrid, ResponsiveContainer, Area, AreaChart,
} from "recharts";
import { Users, TrendingUp, ShieldCheck, BarChart2 } from "lucide-react";
import "./DashboardCharts.css";

/* ── Custom Tooltip ── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--bg-surface)",
      border: "1px solid var(--border-color)",
      borderRadius: "10px",
      padding: "10px 14px",
      boxShadow: "var(--shadow-lg)",
      fontFamily: "var(--font-sans)",
      fontSize: "0.82rem",
    }}>
      <p style={{ color: "var(--text-muted)", fontWeight: 600, marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontWeight: 700 }}>
          {p.name}: <span style={{ color: "var(--text-primary)" }}>{p.value}</span>
        </p>
      ))}
    </div>
  );
};

function DashboardCharts() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    API.get("/patients").then(r => setPatients(r.data)).catch(console.error);
  }, []);

  /* Age groups */
  const ageGroups = [
    { range: "0–20", count: 0 },
    { range: "21–40", count: 0 },
    { range: "41–60", count: 0 },
    { range: "60+", count: 0 },
  ];
  patients.forEach((p) => {
    const age = Number(p.age) || 0;
    if (age <= 20) ageGroups[0].count++;
    else if (age <= 40) ageGroups[1].count++;
    else if (age <= 60) ageGroups[2].count++;
    else ageGroups[3].count++;
  });

  /* Risk distribution */
  const predMap = {};
  patients.forEach((p) => {
    const k = p.prediction || "Low Risk";
    predMap[k] = (predMap[k] || 0) + 1;
  });
  const predData = Object.keys(predMap).map((k) => ({ name: k, value: predMap[k] }));
  const RISK_COLORS = { "High Risk": "#ef4444", "Moderate Risk": "#f59e0b", "Low Risk": "#10b981" };

  /* Monthly trend */
  const monthMap = {};
  patients.forEach((p) => {
    const m = (p.createdAt ? new Date(p.createdAt) : new Date())
      .toLocaleString("default", { month: "short" });
    monthMap[m] = (monthMap[m] || 0) + 1;
  });
  const lineData = Object.keys(monthMap).map((m) => ({ month: m, patients: monthMap[m] }));

  const totalHigh = patients.filter(p => p.prediction === "High Risk").length;
  const totalLow  = patients.filter(p => p.prediction === "Low Risk").length;

  return (
    <div className="charts-dashboard-container">
      <div className="charts-grid">

        {/* ── Age Demographic Bar Chart ── */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <div className="chart-card-title">
                <div className="chart-card-title-icon" style={{ background: "rgba(14,165,233,0.12)", color: "var(--primary)" }}>
                  <Users size={15} />
                </div>
                Age Demographics
              </div>
              <div className="chart-card-subtitle">Distribution across age brackets</div>
            </div>
          </div>

          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageGroups} barSize={32}>
                <defs>
                  <linearGradient id="colorAge" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"  stopColor="#0ea5e9" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.5} vertical={false} />
                <XAxis dataKey="range" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--bg-surface-hover)" }} />
                <Bar dataKey="count" fill="url(#colorAge)" radius={[8, 8, 0, 0]} name="Patients" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-footer-stats">
            <div className="chart-footer-stat">
              <span className="chart-footer-stat-value">{patients.length}</span>
              <span className="chart-footer-stat-label">Total</span>
            </div>
            <div className="chart-footer-stat">
              <span className="chart-footer-stat-value">{ageGroups[2].count + ageGroups[3].count}</span>
              <span className="chart-footer-stat-label">Over 40</span>
            </div>
          </div>
        </div>

        {/* ── Risk Distribution Pie ── */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <div className="chart-card-title">
                <div className="chart-card-title-icon" style={{ background: "rgba(16,185,129,0.12)", color: "var(--accent-emerald)" }}>
                  <ShieldCheck size={15} />
                </div>
                Risk Distribution
              </div>
              <div className="chart-card-subtitle">AI diagnostic risk predictions</div>
            </div>
          </div>

          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={predData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={50}
                  paddingAngle={4}
                  strokeWidth={0}
                >
                  {predData.map((entry, i) => (
                    <Cell key={i} fill={RISK_COLORS[entry.name] || "#3b82f6"} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-footer-stats">
            <div className="chart-footer-stat">
              <span className="chart-footer-stat-value" style={{ color: "var(--risk-high)" }}>{totalHigh}</span>
              <span className="chart-footer-stat-label">High Risk</span>
            </div>
            <div className="chart-footer-stat">
              <span className="chart-footer-stat-value" style={{ color: "var(--risk-low)" }}>{totalLow}</span>
              <span className="chart-footer-stat-label">Low Risk</span>
            </div>
          </div>
        </div>

        {/* ── Monthly Trend Area Chart (full width) ── */}
        <div className="chart-card" style={{ gridColumn: "1 / -1" }}>
          <div className="chart-card-header">
            <div>
              <div className="chart-card-title">
                <div className="chart-card-title-icon" style={{ background: "rgba(139,92,246,0.12)", color: "var(--accent-violet)" }}>
                  <TrendingUp size={15} />
                </div>
                Patient Admission Trend
              </div>
              <div className="chart-card-subtitle">Monthly patient onboarding & registration rate</div>
            </div>
            <div style={{
              fontSize: "0.75rem", fontWeight: 600,
              color: "var(--accent-emerald)",
              background: "var(--risk-low-bg)",
              border: "1px solid var(--risk-low-border)",
              padding: "3px 10px", borderRadius: "var(--radius-full)"
            }}>
              Live Data
            </div>
          </div>

          <div className="chart-wrapper-tall">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineData}>
                <defs>
                  <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.5} vertical={false} />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="patients"
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="url(#colorPatients)"
                  dot={{ r: 5, fill: "#10b981", strokeWidth: 2, stroke: "var(--bg-surface)" }}
                  activeDot={{ r: 8, fill: "#10b981", strokeWidth: 2, stroke: "var(--bg-surface)" }}
                  name="Patients"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCharts;