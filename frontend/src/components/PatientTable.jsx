import { useState } from "react";
import API from "../services/api";
import {
  Search, Plus, Edit2, Trash2, X, Users, UserCheck, Edit3, Lightbulb
} from "lucide-react";
import "./PatientTable.css";

function PatientTable({ patients = [], refresh }) {
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAddModal, setShowAddModal]   = useState(false);
  const [modalError, setModalError]     = useState("");

  const emptyPatient = { name: "", age: "", gender: "Male", glucose: "", bloodPressure: "", bmi: "" };
  const [newPatient, setNewPatient] = useState(emptyPatient);

  const deletePatient = async (id) => {
    if (!window.confirm("Delete this patient record?")) return;
    try {
      await API.delete(`/patients/${id}`);
      refresh();
    } catch (err) {
      alert("Failed to delete patient: " + (err.response?.data?.message || err.message));
    }
  };

  const openEditModal = (p) => {
    setSelectedPatient({ ...p });
    setModalError("");
    setShowEditModal(true);
  };

  const handleEditChange = (e) => setSelectedPatient({ ...selectedPatient, [e.target.name]: e.target.value });
  const handleAddChange  = (e) => setNewPatient({ ...newPatient, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    setModalError("");
    try {
      await API.put(`/patients/${selectedPatient._id}`, selectedPatient);
      setShowEditModal(false);
      refresh();
    } catch (err) {
      setModalError(err.response?.data?.message || "Failed to update patient.");
    }
  };

  const handleAddPatient = async () => {
    setModalError("");
    if (!newPatient.name || !newPatient.age || !newPatient.glucose || !newPatient.bloodPressure || !newPatient.bmi) {
      setModalError("All vitals (Name, Age, Gender, Glucose, Blood Pressure, BMI) are required.");
      return;
    }
    try {
      await API.post("/patients", newPatient);
      setShowAddModal(false);
      setNewPatient(emptyPatient);
      refresh();
    } catch (err) {
      setModalError(err.response?.data?.message || "Failed to register patient.");
    }
  };

  const filtered = patients.filter((p) =>
    (p.name || "").toLowerCase().includes(search.toLowerCase()) &&
    (filter === "" || p.prediction === filter)
  );

  const getInitials = (name) => {
    if (!name) return "P";
    const parts = name.trim().split(" ");
    return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name.substring(0, 2).toUpperCase();
  };

  const getBadgeClass = (pred) => {
    if (pred === "High Risk") return "badge-high";
    if (pred === "Moderate Risk") return "badge-moderate";
    return "badge-low";
  };

  const modalFields = (data, onChange, isEdit = false) => (
    <>
      {modalError && (
        <div style={{ padding: "10px", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", borderRadius: "8px", color: "#ef4444", marginBottom: "16px", fontSize: "0.85rem" }}>
          ⚠ {modalError}
        </div>
      )}
      <div className="form-group">
        <label>Full Name *</label>
        <input name="name" className="form-control" value={data.name || ""} onChange={onChange} placeholder="e.g. Sarah Connor" required />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Age *</label>
          <input name="age" type="number" className="form-control" value={data.age || ""} onChange={onChange} placeholder="e.g. 34" required />
        </div>
        <div className="form-group">
          <label>Gender *</label>
          <select name="gender" className="form-control" value={data.gender || "Male"} onChange={onChange}>
            <option>Male</option><option>Female</option><option>Other</option>
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Glucose (mg/dL) *</label>
          <input name="glucose" type="number" className="form-control" value={data.glucose || ""} onChange={onChange} placeholder="e.g. 115" required />
        </div>
        <div className="form-group">
          <label>Blood Pressure *</label>
          <input name="bloodPressure" className="form-control" value={data.bloodPressure || ""} onChange={onChange} placeholder="e.g. 120/80" required />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>BMI *</label>
          <input name="bmi" type="number" step="0.1" className="form-control" value={data.bmi || ""} onChange={onChange} placeholder="e.g. 24.5" required />
        </div>
        {isEdit && (
          <div className="form-group">
            <label>Risk Assessment Override</label>
            <select name="prediction" className="form-control" value={data.prediction || "Low Risk"} onChange={onChange}>
              <option>Low Risk</option><option>Moderate Risk</option><option>High Risk</option>
            </select>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="patient-table-card">
      {/* Toolbar */}
      <div className="table-toolbar">
        <div className="table-title-group">
          <h3>Patient Records</h3>
          <p>Manage biometric data, diagnostics and AI risk assessments</p>
        </div>

        <div className="toolbar-actions">
          <div className="search-box-wrapper">
            <Search className="search-icon" size={15} />
            <input
              id="patient-search"
              type="text"
              className="search-input"
              placeholder="Search patients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select id="risk-filter" className="filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All Risk Categories</option>
            <option value="Low Risk">Low Risk</option>
            <option value="Moderate Risk">Moderate Risk</option>
            <option value="High Risk">High Risk</option>
          </select>

          <span className="table-count-chip"><Users size={12} />{filtered.length}</span>

          <button id="add-patient-btn" className="btn-primary" onClick={() => { setNewPatient(emptyPatient); setModalError(""); setShowAddModal(true); }}>
            <Plus size={15} />
            <span>Add Patient</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Glucose</th>
              <th>Blood Pressure</th>
              <th>BMI</th>
              <th>Risk Level</th>
              <th>AI Recommendation</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? filtered.map((p) => (
              <tr key={p._id}>
                <td>
                  <div className="patient-cell">
                    <div className="patient-avatar">{getInitials(p.name)}</div>
                    <div className="patient-name-box">
                      <span className="patient-name-text">{p.name}</span>
                      <span className="patient-id-sub">#{p._id ? p._id.slice(-6) : "N/A"}</span>
                    </div>
                  </div>
                </td>
                <td><span className="metric-value">{p.age}</span></td>
                <td>{p.gender}</td>
                <td><span className="metric-value">{p.glucose} mg/dL</span></td>
                <td><span className="metric-value">{p.bloodPressure}</span></td>
                <td><span className="metric-value">{p.bmi}</span></td>
                <td>
                  <span className={`badge ${getBadgeClass(p.prediction)}`}>
                    {p.prediction || "Low Risk"}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "var(--text-muted)", maxWidth: "220px" }} title={p.suggestion}>
                    <Lightbulb size={13} style={{ color: p.prediction === "High Risk" ? "#ef4444" : "var(--primary)", flexShrink: 0 }} />
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {p.suggestion || "Routine clinical follow-up."}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="action-buttons" style={{ justifyContent: "flex-end" }}>
                    <button className="btn-action-icon edit" onClick={() => openEditModal(p)} title="Edit">
                      <Edit2 size={14} />
                    </button>
                    <button className="btn-action-icon delete" onClick={() => deletePatient(p._id)} title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="9" className="empty-state">
                  <div className="empty-state-icon"><UserCheck size={24} /></div>
                  <div className="empty-state-text">No patients found</div>
                  <div className="empty-state-sub">Try adjusting your search or filter criteria</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="table-footer-bar">
        <span className="table-footer-info">Showing {filtered.length} of {patients.length} records</span>
      </div>

      {/* EDIT MODAL */}
      {showEditModal && selectedPatient && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowEditModal(false)}>
          <div className="modal-box">
            <div className="modal-header">
              <div className="modal-header-left">
                <div className="modal-header-icon"><Edit3 size={16} /></div>
                <h3>Edit Patient Record</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setShowEditModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">{modalFields(selectedPatient, handleEditChange, true)}</div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleUpdate}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}>
          <div className="modal-box">
            <div className="modal-header">
              <div className="modal-header-left">
                <div className="modal-header-icon"><Plus size={16} /></div>
                <h3>Register New Patient</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setShowAddModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">{modalFields(newPatient, handleAddChange, false)}</div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleAddPatient}>Register Patient</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientTable;