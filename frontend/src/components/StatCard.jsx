import "./StatCard.css";

const colorConfig = {
  blue:   { bg: "rgba(14,165,233,0.12)",  color: "#0ea5e9",  accentColor: "rgba(14,165,233,0.08)",  border: "rgba(14,165,233,0.25)"  },
  red:    { bg: "rgba(239,68,68,0.12)",   color: "#ef4444",  accentColor: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.25)"   },
  yellow: { bg: "rgba(245,158,11,0.12)",  color: "#f59e0b",  accentColor: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.25)"  },
  green:  { bg: "rgba(16,185,129,0.12)",  color: "#10b981",  accentColor: "rgba(16,185,129,0.08)",  border: "rgba(16,185,129,0.25)"  },
  purple: { bg: "rgba(139,92,246,0.12)",  color: "#8b5cf6",  accentColor: "rgba(139,92,246,0.08)",  border: "rgba(139,92,246,0.25)"  },
};

function StatCard({ title, value, icon: Icon, trend, subtext, color = "blue" }) {
  const theme = colorConfig[color] || colorConfig.blue;

  return (
    <div
      className="stat-card"
      style={{
        "--card-accent-color": theme.accentColor,
        "--card-accent-border": theme.border,
      }}
    >
      {/* Header */}
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        <div
          className="stat-card-icon"
          style={{ background: theme.bg, color: theme.color }}
        >
          {Icon && <Icon size={20} strokeWidth={2} />}
        </div>
      </div>

      {/* Value */}
      <div className="stat-card-value">{value}</div>

      {/* Footer */}
      {subtext && (
        <div className="stat-card-footer">
          {trend && (
            <span className={`stat-trend ${trend.type}`}>
              {trend.value}
            </span>
          )}
          <span className="stat-subtext">{subtext}</span>
        </div>
      )}
    </div>
  );
}

export default StatCard;
