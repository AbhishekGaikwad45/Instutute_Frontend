import React, { useState } from "react";
import api from "../Api/axiosInstance";
import { toast } from "react-toastify";

export default function BatchStudents() {

  const [batchCode, setBatchCode] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  // ---------------- VALIDATION ----------------
  const isValidBatchCode = (code) => /^[A-Z]{3}-\d{3,}$/.test(code);

  // ---------------- LOAD STUDENTS ----------------
  const loadStudents = async () => {

    if (!batchCode) {
      toast.warning("Please enter batch code");
      return;
    }

    if (!isValidBatchCode(batchCode)) {
      toast.error("Invalid Batch Code format (Ex: NOV-396)");
      return;
    }

    try {
      setLoading(true);
      const res = await api.get(`/api/batch/${batchCode}/students`);
      setStudents(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to load students");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- REMOVE STUDENT ----------------
  const removeStudent = async (studentId) => {

    if (!batchCode) {
      toast.error("Batch code missing");
      return;
    }

    if (!window.confirm("Remove student from this batch?")) return;

    try {
      await api.delete("/api/batch/remove-student", {
        params: { studentId, batchCode }
      });

      toast.success("Student removed successfully");
      loadStudents(); // reload list
    } catch {
      toast.error("Remove failed");
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="container mt-4">

      <h3 className="fw-bold mb-3">Batch-wise Students</h3>

      {/* Batch Code */}
      <input
        className="form-control mb-3"
        placeholder="Enter Batch Code (NOV-396)"
        value={batchCode}
        onChange={(e) => {
          setBatchCode(e.target.value.toUpperCase());
          setStudents([]); // reset list on change
        }}
      />

      {/* Load Button */}
      <button
        className="btn btn-primary mb-3"
        onClick={loadStudents}
        disabled={loading}
      >
        {loading ? "Loading..." : "Load Students"}
      </button>

      {/* Empty */}
      {students.length === 0 && !loading && (
        <div className="alert alert-info">
          No students in this batch
        </div>
      )}

      {/* Table */}
      {students.length > 0 && (
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Student ID</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s, i) => (
              <tr key={s.studentId}>
                <td>{i + 1}</td>
                <td>{s.studentId}</td>
                <td>{s.name}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => removeStudent(s.studentId)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  );
}
