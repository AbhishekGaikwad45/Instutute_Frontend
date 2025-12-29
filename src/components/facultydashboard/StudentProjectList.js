import React, { useEffect, useState } from "react";
import api from "../Api/axiosInstance"; // ✅ axios instance

export default function StudentProjectList() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    studentId: "",
    studentName: "",
    projectTopic: "",
    technology: "",
    description: "",
    status: "",
    assignedDate: "",
    completedDate: "",
  });

  // ---------------- LOAD ALL PROJECTS ----------------
  const load = async () => {
    try {
      const res = await api.get("/api/project/all");
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setData([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ---------------- SEARCH FILTER ----------------
  const filtered = data.filter((p) => {
    const t = search.toLowerCase();
    return (
      p.studentId?.toLowerCase().includes(t) ||
      p.projectTopic?.toLowerCase().includes(t) ||
      p.technology?.toLowerCase().includes(t)
    );
  });

  // ---------------- OPEN UPDATE MODAL ----------------
  const openEditModal = (p) => {
    setEditData(p);
    setShowModal(true);
  };

  // ---------------- SAVE UPDATE ----------------
  const saveUpdate = async () => {
    try {
      await api.put(`/api/project/update/${editData.id}`, editData);
      setShowModal(false);
      load();
    } catch (err) {
      console.error(err);
      alert("Update failed!");
    }
  };

  // ---------------- DELETE PROJECT ----------------
  const deleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      await api.delete(`/api/project/delete/${id}`);
      load();
    } catch (err) {
      console.error(err);
      alert("Delete failed!");
    }
  };

  // ---------------- COLOR HELPERS ----------------
  const techColor = (tech) => {
    switch (tech) {
      case "MERN": return "#007bff";
      case "React": return "#6f42c1";
      case "Java": return "#ff8c00";
      case "Python": return "#28a745";
      case "Node.js": return "#0d6efd";
      case "Spring Boot": return "#198754";
      case "Full Stack": return "#6610f2";
      default: return "#6c757d";
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "COMPLETED": return "#28a745";
      case "IN_PROGRESS": return "#ff8c00";
      case "NOT_STARTED": return "#6c757d";
      default: return "#000";
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-primary mb-3">Student Project Report</h2>

      {/* SEARCH */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by Student ID, Project Topic, Technology..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABLE */}
      <table className="table table-bordered table-hover shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Student ID</th>
            <th>Student Name</th>
            <th>Project Topic</th>
            <th>Technology</th>
            <th>Description</th>
            <th>Status</th>
            <th>Assigned Date</th>
            <th>Submitted</th>
            <th style={{ width: "140px" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center text-danger">
                No Projects Found
              </td>
            </tr>
          ) : (
            filtered.map((p) => (
              <tr key={p.id}>
                <td>{p.studentId}</td>
                <td>{p.studentName || "—"}</td>

                <td><strong>{p.projectTopic}</strong></td>

                <td style={{ color: techColor(p.technology), fontWeight: "600" }}>
                  {p.technology}
                </td>

                <td>{p.description}</td>

                <td style={{ color: statusColor(p.status), fontWeight: "700" }}>
                  {p.status.replace("_", " ")}
                </td>

                <td>{p.assignedDate}</td>
                <td>{p.completedDate || "—"}</td>

                <td className="d-flex justify-content-between">
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => openEditModal(p)}
                  >
                    Update
                  </button>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteProject(p.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* UPDATE MODAL */}
      {showModal && (
        <div
          className="modal show fade d-block"
          style={{ background: "#00000050", marginTop: "60px" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Update Project</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>

              <div className="modal-body" style={{ maxHeight: "60vh", overflowY: "auto" }}>
                {[
                  ["studentId", "Student ID"],
                  ["studentName", "Student Name"],
                  ["projectTopic", "Project Topic"],
                  ["technology", "Technology"],
                ].map(([key, label]) => (
                  <input
                    key={key}
                    className="form-control mb-2"
                    placeholder={label}
                    value={editData[key]}
                    onChange={(e) =>
                      setEditData({ ...editData, [key]: e.target.value })
                    }
                  />
                ))}

                <input
                  type="date"
                  className="form-control mb-2"
                  value={editData.assignedDate}
                  onChange={(e) =>
                    setEditData({ ...editData, assignedDate: e.target.value })
                  }
                />

                <input
                  type="date"
                  className="form-control mb-2"
                  value={editData.completedDate}
                  onChange={(e) =>
                    setEditData({ ...editData, completedDate: e.target.value })
                  }
                />

                <textarea
                  className="form-control mb-2"
                  placeholder="Description"
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                />

                <select
                  className="form-control mb-2"
                  value={editData.status}
                  onChange={(e) =>
                    setEditData({ ...editData, status: e.target.value })
                  }
                >
                  <option value="NOT_STARTED">Not Started</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>

                <button className="btn btn-primary" onClick={saveUpdate}>
                  Save Changes
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
