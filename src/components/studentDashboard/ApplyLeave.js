import React, { useEffect, useState } from "react";
import api from "../Api/axiosInstance";
import { toast } from "react-toastify";

export default function ApplyLeave() {

  const student = JSON.parse(localStorage.getItem("student"));

  const [form, setForm] = useState({
    fromDate: "",
    toDate: "",
    reason: ""
  });

  const [myLeaves, setMyLeaves] = useState([]);
  const [loading, setLoading] = useState(false);

  // ---------------- LOAD MY LEAVES ----------------
  const loadMyLeaves = async () => {
    try {
      const res = await api.get(
        `/api/leave/student/${student.studentId}`
      );
      setMyLeaves(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to load leave history");
    }
  };

  useEffect(() => {
    loadMyLeaves();
  }, []);

  // ---------------- APPLY LEAVE ----------------
  const submit = async () => {

    if (!form.fromDate || !form.toDate || !form.reason.trim()) {
      toast.warning("Please fill all fields");
      return;
    }

    if (form.toDate < form.fromDate) {
      toast.error("To date cannot be before From date");
      return;
    }

    try {
      setLoading(true);

      await api.post("/api/leave/apply", {
        studentId: student.studentId,
        fromDate: form.fromDate,
        toDate: form.toDate,
        reason: form.reason
      });

      toast.success("Leave Applied Successfully");
      setForm({ fromDate: "", toDate: "", reason: "" });

      loadMyLeaves(); // 🔄 refresh list

    } catch {
      toast.error("Failed to apply leave");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- STATUS BADGE ----------------
  const getStatusBadge = (status) => {
    if (status === "APPROVED") return "success";
    if (status === "REJECTED") return "danger";
    return "warning";
  };

  return (
    <div className="container mt-4">

      {/* APPLY LEAVE FORM */}
      <div className="card shadow p-3 mb-4">
        <h3 className="fw-bold mb-3">Apply Leave</h3>

        <label className="fw-semibold">From Date</label>
        <input
          type="date"
          className="form-control mb-2"
          value={form.fromDate}
          onChange={(e) =>
            setForm({ ...form, fromDate: e.target.value })
          }
        />

        <label className="fw-semibold">To Date</label>
        <input
          type="date"
          className="form-control mb-2"
          value={form.toDate}
          onChange={(e) =>
            setForm({ ...form, toDate: e.target.value })
          }
        />

        <label className="fw-semibold">Reason</label>
        <textarea
          className="form-control mb-3"
          placeholder="Enter reason for leave"
          value={form.reason}
          onChange={(e) =>
            setForm({ ...form, reason: e.target.value })
          }
        />

        <button
          className="btn btn-primary"
          onClick={submit}
          disabled={loading}
        >
          {loading ? "Applying..." : "Apply Leave"}
        </button>
      </div>

      {/* MY LEAVES */}
      <div className="card shadow p-3">
        <h4 className="fw-bold mb-3">My Leave Requests</h4>

        {myLeaves.length === 0 && (
          <div className="alert alert-info">
            No leave requests found
          </div>
        )}

        {myLeaves.length > 0 && (
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>From</th>
                <th>To</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Counselor Remark</th>
              </tr>
            </thead>

            <tbody>
              {[...myLeaves]
                .sort(
                  (a, b) =>
                    new Date(b.appliedAt || b.fromDate) -
                    new Date(a.appliedAt || a.fromDate)
                )
                .map((l) => (
                  <tr key={l.id}>
                    <td>{l.fromDate}</td>
                    <td>{l.toDate}</td>
                    <td>{l.reason}</td>
                    <td>
                      <span
                        className={`badge bg-${getStatusBadge(
                          l.status
                        )}`}
                      >
                        {l.status}
                      </span>
                    </td>
                    <td>{l.counselorRemark || "-"}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}
