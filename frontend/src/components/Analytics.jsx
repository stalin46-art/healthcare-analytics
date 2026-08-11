import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis,
  LineChart, Line, ResponsiveContainer,
  CartesianGrid, AreaChart, Area,
} from "recharts";
import { PieChart as PieIcon, BarChart2, Activity, ShieldAlert, TrendingUp, Lightbulb } from "lucide-react";
import "./Analytics.css";

/* Custom Tooltip */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--bg-surface)", border: "1px solid var(--border-color)",
      borderRadius: "10px", padding: "10px 14px", boxShadow: "var(--shadow-lg)",
      fontFamily: "var(--font-sans)", fontSize: "0.82rem",
    }}>
      {label && <p style={{ color: "var(--text-muted)", fontWeight: 600, marginBottom: 4 }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontWeight: 700 }}>
          {p.name}: <span style={{ color: "var(--text-primary)" }}>{p.value}</span>
        </p>
      ))}
    </div>
  );
};

function Analytics({ patients = [] }) {
  const high     = patients.filter((p) => p.prediction === "High Risk").length;
  const moderate = patients.filter((p) => p.prediction === "Moderate Risk").length;
  const low      = patients.filter((p) => p.prediction === "Low Risk").length;
  const total    = patients.length;

  const pieData = [
    { name: "High Risk",     value: high,     color: "#ef4444" },
    { name: "Moderate Risk", value: moderate, color: "#f59e0b" },
    { name: "Low Risk",      value: low,      color: "#10b981" },
  ];

  const sampleData = patients.slice(0, 10).map((p) => ({
    name:          p.name ? p.name.split(" ")[0] : "Patient",
    bmi:           Number(p.bmi) || 0,
    glucose:       Number(p.glucose) || 0,
    bloodPressure: Number(p.bloodPressure) || 0,
  }));

  const avgGlucose = total
    ? (patients.reduce((s, p) => s + (Number(p.glucose) || 0), 0) / total).toFixed(1) : 0;
  const avgBmi = total
    ? (patients.reduce((s, p) => s + (Number(p.bmi) || 0), 0) / total).toFixed(1) : 0;

  return (
    <div className="analytics-container">
      {/* Header */}
      <div className="analytics-header">
        <div className="analytics-title-group">
          <h3>Advanced Patient Analytics</h3>
          <p>Distribution metrics and biometric indicators across {total} registered patients</p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="analytics-kpi-row">
        <div className="analytics-kpi-card">
          <div className="analytics-kpi-dot" style={{ background: "#ef4444", boxShadow: "0 0 8px rgba(239,68,68,0.5)" }} />
          <div>
            <div className="analytics-kpi-label">High Risk</div>
            <div className="analytics-kpi-value" style={{ color: "#ef4444" }}>{high}</div>
          </div>
        </div>
        <div className="analytics-kpi-card">
          <div className="analytics-kpi-dot" style={{ background: "#f59e0b", boxShadow: "0 0 8px rgba(245,158,11,0.5)" }} />
          <div>
            <div className="analytics-kpi-label">Moderate Risk</div>
            <div className="analytics-kpi-value" style={{ color: "#f59e0b" }}>{moderate}</div>
          </div>
        </div>
        <div className="analytics-kpi-card">
          <div className="analytics-kpi-dot" style={{ background: "#10b981", boxShadow: "0 0 8px rgba(16,185,129,0.5)" }} />
          <div>
            <div className="analytics-kpi-label">Low Risk</div>
            <div className="analytics-kpi-value" style={{ color: "#10b981" }}>{low}</div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="analytics-grid">

        {/* ── Risk Distribution Pie ── */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <span className="analytics-card-title">
              <div className="analytics-card-title-icon" style={{ background: "rgba(14,165,233,0.12)", color: "var(--primary)" }}>
                <PieIcon size={15} />
              </div>
              Risk Classification
            </span>
          </div>

          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={4}
                  strokeWidth={0}
                >
                  {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="legend-custom">
            {pieData.map((e) => (
              <div className="legend-item" key={e.name}>
                <div className="legend-color" style={{ background: e.color }} />
                <span>{e.name} ({e.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── BMI Bar Chart ── */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <span className="analytics-card-title">
              <div className="analytics-card-title-icon" style={{ background: "rgba(139,92,246,0.12)", color: "var(--accent-violet)" }}>
                <BarChart2 size={15} />
              </div>
              Patient BMI Profile
            </span>
          </div>

          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sampleData} barSize={24}>
                <defs>
                  <linearGradient id="colorBmi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#8b5cf6" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.5} vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--bg-surface-hover)" }} />
                <Bar dataKey="bmi" fill="url(#colorBmi)" radius={[6, 6, 0, 0]} name="BMI" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Glucose Area Chart (full width) ── */}
        <div className="analytics-card" style={{ gridColumn: "1 / -1" }}>
          <div className="analytics-card-header">
            <span className="analytics-card-title">
              <div className="analytics-card-title-icon" style={{ background: "rgba(14,165,233,0.12)", color: "var(--primary)" }}>
                <Activity size={15} />
              </div>
              Blood Glucose Monitor (mg/dL)
            </span>
            <div style={{
              fontSize: "0.75rem", fontWeight: 700,
              color: Number(avgGlucose) > 140 ? "var(--risk-high)" : "var(--risk-low)",
              background: Number(avgGlucose) > 140 ? "var(--risk-high-bg)" : "var(--risk-low-bg)",
              border: `1px solid ${Number(avgGlucose) > 140 ? "var(--risk-high-border)" : "var(--risk-low-border)"}`,
              padding: "3px 10px", borderRadius: "var(--radius-full)",
            }}>
              Avg: {avgGlucose} mg/dL
            </div>
          </div>

          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sampleData}>
                <defs>
                  <linearGradient id="colorGlucose" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#0ea5e9" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.5} vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="glucose"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  fill="url(#colorGlucose)"
                  dot={{ r: 5, fill: "var(--primary)", strokeWidth: 2, stroke: "var(--bg-surface)" }}
                  activeDot={{ r: 8, strokeWidth: 2, stroke: "var(--bg-surface)" }}
                  name="Glucose"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Insight Cards */}
      <div className="analytics-insight-row">
        <div className="insight-card">
          <div className="insight-icon"><Lightbulb size={18} /></div>
          <div className="insight-text">
            <strong>Glucose Insight</strong>
            Average glucose of {avgGlucose} mg/dL — {Number(avgGlucose) > 140 ? "above target range. Consider dietary review." : "within healthy target range."}
          </div>
        </div>
        <div className="insight-card">
          <div className="insight-icon" style={{ background: "var(--accent-violet-light)", color: "var(--accent-violet)" }}>
            <TrendingUp size={18} />
          </div>
          <div className="insight-text">
            <strong>BMI Insight</strong>
            Average BMI of {avgBmi} — {Number(avgBmi) > 25 ? "overweight range detected. Recommend lifestyle review." : "within healthy baseline."}
          </div>
        </div>
        <div className="insight-card">
          <div className="insight-icon" style={{ background: "var(--risk-high-bg)", color: "var(--risk-high)" }}>
            <ShieldAlert size={18} />
          </div>
          <div className="insight-text">
            <strong>Risk Summary</strong>
            {high} high-risk patients ({total ? ((high / total) * 100).toFixed(0) : 0}% of registry) require immediate clinical attention.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;