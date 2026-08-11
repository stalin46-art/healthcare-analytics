import { useState } from "react";
import API from "../services/api";
import { User, Calendar, Activity, Heart, Scale, UserPlus, Cpu, CheckCircle, RotateCcw } from "lucide-react";
import "./PatientForm.css";

function PatientForm({ refresh }) {
  const empty = { name: "", age: "", gender: "Male", bmi: "", glucose: "", bloodPressure: "" };
  const [form, setForm]             = useState(empty);
  const [lastPrediction, setLastPrediction] = useState(null);
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLastPrediction(null);

    if (!form.name || !form.age || !form.glucose || !form.bloodPressure || !form.bmi) {
      setError("All clinical fields (Name, Age, Gender, Glucose, Blood Pressure, BMI) are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/patients", form);
      setForm(empty);
      setLastPrediction(res.data);
      if (refresh) refresh();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to submit patient data. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "name",          label: "Full Name *",           type: "text",   icon: User,     placeholder: "e.g. Eleanor Vance" },
    { name: "age",           label: "Age *",                 type: "number", icon: Calendar, placeholder: "e.g. 45" },
    { name: "bmi",           label: "BMI (kg/m²) *",         type: "number", icon: Scale,    placeholder: "e.g. 26.4", step: "0.1" },
    { name: "glucose",       label: "Glucose (mg/dL) *",     type: "number", icon: Activity, placeholder: "e.g. 110" },
    { name: "bloodPressure", label: "Blood Pressure *",      type: "text",   icon: Heart,    placeholder: "e.g. 120/80" },
  ];

  return (
    <form className="patient-form-card" onSubmit={submit}>
      {/* Header */}
      <div className="form-header-group">
        <div className="form-header-icon">
          <UserPlus size={20} />
        </div>
        <div className="form-header-text">
          <h3>Quick Add Patient Record</h3>
          <p>Input clinical vitals — AI will automatically compute risk assessment</p>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <span className="ai-chip"><Cpu size={10} /> AI Enabled</span>
        </div>
      </div>

      <div className="form-body">
        {/* Error Alert */}
        {error && (
          <div style={{ padding: "12px 16px", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", borderRadius: "10px", color: "#ef4444", marginBottom: "16px", fontSize: "0.88rem", fontWeight: 500 }}>
            ⚠ {error}
          </div>
        )}

        {/* Success toast / AI Prediction banner */}
        {lastPrediction && (
          <div className="form-success-toast" style={{ flexDirection: "column", alignItems: "flex-start", gap: "6px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 600, fontSize: "0.95rem" }}>
              <CheckCircle size={18} />
              Patient Registered — Risk Assessed: <span style={{ color: lastPrediction.prediction === "High Risk" ? "#ef4444" : lastPrediction.prediction === "Moderate Risk" ? "#f59e0b" : "#10b981" }}>{lastPrediction.prediction}</span>
            </div>
            <div style={{ fontSize: "0.84rem", opacity: 0.95, paddingLeft: "26px" }}>
              💡 <strong>AI Recommendation:</strong> {lastPrediction.suggestion || "Standard care & routine monitoring."}
            </div>
          </div>
        )}

        <div className="form-section-divider">Patient Vitals & Demographics</div>

        <div className="patient-form-grid">
          {fields.map(({ name, label, type, icon: Icon, placeholder, step }) => (
            <div className="form-field-wrapper" key={name}>
              <label>{label}</label>
              <div className="input-with-icon">
                <Icon className="field-icon" size={15} />
                <input
                  id={`field-${name}`}
                  name={name}
                  type={type}
                  step={step}
                  className="form-control"
                  placeholder={placeholder}
                  value={form[name]}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          ))}

          {/* Gender select */}
          <div className="form-field-wrapper">
            <label>Gender *</label>
            <select id="field-gender" name="gender" className="form-control" value={form.gender} onChange={handleChange}>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="form-actions-row">
        <div className="form-actions-left">
          * All clinical vitals are required for AI risk assessment
        </div>
        <div className="form-actions-right">
          <button type="button" className="btn-secondary" onClick={() => { setForm(empty); setError(""); setLastPrediction(null); }}>
            <RotateCcw size={14} />
            Reset
          </button>
          <button id="submit-patient" type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
            ) : (
              <UserPlus size={15} />
            )}
            {loading ? "Processing..." : "Submit & Predict Risk"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default PatientForm;