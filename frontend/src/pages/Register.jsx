import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { HeartPulse, User, Mail, Lock, UserPlus, AlertCircle, ShieldCheck, Activity, Cpu } from "lucide-react";
import "./Login.css";
import "./Register.css";

function Register() {
  const [name, setName] = useState("");
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
      const res = await API.post("/auth/register", { name, email, password });
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        if (res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Email may already be in use.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Left Panel */}
      <div className="auth-left-panel">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-orb auth-orb-3" />

        <div className="auth-panel-content">
          <div className="auth-panel-icon">
            <HeartPulse size={36} color="#fff" />
          </div>
          <h1 className="auth-panel-title">Join the Platform</h1>
          <p className="auth-panel-subtitle">
            Register your clinician credentials and start leveraging AI-powered patient analytics
          </p>

          <div className="auth-features">
            <div className="auth-feature-item">
              <div className="auth-feature-dot" />
              <span className="auth-feature-text">Instant access to analytics dashboard</span>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-dot" />
              <span className="auth-feature-text">Secure encrypted patient data storage</span>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-dot" />
              <span className="auth-feature-text">Collaborative care team workflows</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-right-panel">
        <div className="auth-card">
          <div className="auth-card-header">
            <Link to="/" className="auth-card-logo">
              <div className="auth-card-logo-icon">
                <HeartPulse size={20} />
              </div>
              <span className="auth-card-logo-text">MedPulse</span>
            </Link>
            <h2 className="auth-card-title">Create account</h2>
            <p className="auth-card-desc">Register your clinician credentials to get started</p>
          </div>

          {error && (
            <div className="auth-error-alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={submit}>
            <div className="auth-field">
              <label>Full Name & Title</label>
              <div className="auth-input-wrapper">
                <User className="auth-icon" size={17} />
                <input
                  id="register-name"
                  type="text"
                  className="auth-input"
                  placeholder="Dr. Eleanor Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label>Email Address</label>
              <div className="auth-input-wrapper">
                <Mail className="auth-icon" size={17} />
                <input
                  id="register-email"
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
              <label>Password</label>
              <div className="auth-input-wrapper">
                <Lock className="auth-icon" size={17} />
                <input
                  id="register-password"
                  type="password"
                  className="auth-input"
                  placeholder="Create a secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button id="register-submit" type="submit" className="auth-btn" disabled={loading}>
              {loading ? <span className="auth-spinner" /> : <UserPlus size={18} />}
              <span>{loading ? "Creating Account..." : "Register Credentials"}</span>
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
            <span>Already registered?</span>
            <Link to="/" className="auth-link">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;