import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { HeartPulse, Mail, Lock, LogIn, AlertCircle, ShieldCheck, Activity, Cpu } from "lucide-react";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid credentials. Please check your email and password.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Left Illustration Panel */}
      <div className="auth-left-panel">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-orb auth-orb-3" />

        <div className="auth-panel-content">
          <div className="auth-panel-icon">
            <HeartPulse size={36} color="#fff" />
          </div>
          <h1 className="auth-panel-title">MedPulse Analytics</h1>
          <p className="auth-panel-subtitle">
            Real-time clinical intelligence platform powered by AI for modern healthcare professionals
          </p>

          <div className="auth-features">
            <div className="auth-feature-item">
              <div className="auth-feature-dot" />
              <span className="auth-feature-text">AI-powered risk prediction engine</span>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-dot" />
              <span className="auth-feature-text">Real-time patient vitals monitoring</span>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-dot" />
              <span className="auth-feature-text">Advanced clinical analytics & insights</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="auth-right-panel">
        <div className="auth-card">
          <div className="auth-card-header">
            <Link to="/" className="auth-card-logo">
              <div className="auth-card-logo-icon">
                <HeartPulse size={20} />
              </div>
              <span className="auth-card-logo-text">MedPulse</span>
            </Link>
            <h2 className="auth-card-title">Welcome back</h2>
            <p className="auth-card-desc">Sign in to your clinical analytics portal</p>
          </div>

          {error && (
            <div className="auth-error-alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={submit}>
            <div className="auth-field">
              <label>Email Address</label>
              <div className="auth-input-wrapper">
                <Mail className="auth-icon" size={17} />
                <input
                  id="login-email"
                  type="email"
                  className="auth-input"
                  placeholder="doctor@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <div className="auth-field-row">
                <label>Password</label>
                <span className="auth-forgot">Forgot password?</span>
              </div>
              <div className="auth-input-wrapper">
                <Lock className="auth-icon" size={17} />
                <input
                  id="login-password"
                  type="password"
                  className="auth-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button id="login-submit" type="submit" className="auth-btn" disabled={loading}>
              {loading ? (
                <span className="auth-spinner" />
              ) : (
                <LogIn size={18} />
              )}
              <span>{loading ? "Authenticating..." : "Sign In to Portal"}</span>
            </button>
          </form>

          <div className="auth-trust-row">
            <div className="auth-trust-item">
              <ShieldCheck size={14} />
              <span>HIPAA Compliant</span>
            </div>
            <div className="auth-trust-item">
              <Activity size={14} />
              <span>99.9% Uptime</span>
            </div>
            <div className="auth-trust-item">
              <Cpu size={14} />
              <span>AI Powered</span>
            </div>
          </div>

          <div className="auth-footer">
            <span>New to MedPulse?</span>
            <Link to="/register" className="auth-link">Create account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;