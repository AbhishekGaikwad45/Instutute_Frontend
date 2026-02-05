import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../Api/axiosInstance"; // ✅ axios instance

export default function FacultyAttendance({ faculty }) {
  const batchCode = localStorage.getItem("selectedBatch");

  const [students, setStudents] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [markDate, setMarkDate] = useState("");
  const [topic, setTopic] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!batchCode) return;
    loadStudents();
  }, [batchCode]);

  // ================= LOAD STUDENTS =================
  const loadStudents = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/api/batch/${batchCode}/students`);
      const arr = Array.isArray(res.data) ? res.data : [];

      setStudents(arr);

      // Default all to PRESENT
      const temp = {};
      arr.forEach((s) => {
        const id = String(
          s.studentId ?? s.id ?? s.student_id ?? s._id ?? ""
        );
        temp[id] = "PRESENT";
      });
      setStatusMap(temp);

      // default date = today
      const today = new Date().toISOString().slice(0, 10);
      setMarkDate(today);

      // clear topic
      setTopic("");
    } catch (err) {
      console.error("Failed to load students", err);
      toast.error("Failed to load students for selected batch.");
      setStudents([]);
      setStatusMap({});
    } finally {
      setLoading(false);
    }
  };

  // ================= TOGGLE STATUS =================
  const toggle = (id) => {
    setStatusMap((prev) => ({
      ...prev,
      [id]: prev[id] === "PRESENT" ? "ABSENT" : "PRESENT",
    }));
  };

  // ================= SAVE ATTENDANCE =================
  const saveAttendance = async () => {
  if (!batchCode) {
    toast.error("No batch selected.");
    return;
  }

  if (!faculty || !faculty.id ) {
    toast.error("Faculty information missing. Please login again.");
    return;
  }

  if (!markDate) {
    toast.error("Please select date.");
    return;
  }

  if (!topic.trim()) {
    toast.error("Please enter today's topic.");
    return;
  }

  const records = Object.keys(statusMap).map((id) => ({
    studentId: id,
    status: statusMap[id],
  }));

  const payload = {
    batchCode,
    facultyId: faculty.id,          // ✅ guaranteed now
        date: markDate,
    topic: topic.trim(),
    records,
  };

  try {
    setSaving(true);
    const res = await api.post("/api/attendance/mark", payload);

    if (res.data?.message === "ALREADY_SAVED") {
      toast.error("Attendance already marked!");
      return;
    }

    toast.success("Attendance saved successfully!");
    setTopic("");
  } catch (err) {
    console.error(err);
    toast.error("Server error while saving attendance.");
  } finally {
    setSaving(false);
  }
};


  // ================= UI STATES =================
  if (!batchCode) {
    return (
      <div className="container mt-4">
        <p className="text-warning">
          No batch selected. Go to Dashboard and select a batch.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mt-4">Loading students...</div>
    );
  }

  return (
    <div className="container mt-4">
      <h3>Mark Attendance — {batchCode}</h3>

      <div className="card p-3 mt-3">
        <label className="fw-semibold">Select Date</label>
        <input
          type="date"
          className="form-control w-25 mb-3"
          value={markDate}
          onChange={(e) => setMarkDate(e.target.value)}
        />

        <label className="fw-semibold mt-2">Today's Topic</label>
        <input
          type="text"
          className="form-control w-50 mb-3"
          placeholder="Enter today's topic (what you taught)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        {students.length === 0 && (
          <p className="text-muted">
            No students found for this batch.
          </p>
        )}

        {students.map((s) => {
          const id = String(
            s.studentId ?? s.id ?? s.student_id ?? s._id ?? ""
          );
          const name =
            s.name ?? s.fullName ?? s.studentName ?? "Unknown";

          return (
            <div
              key={id}
              className="d-flex justify-content-between align-items-center bg-white p-3 shadow-sm rounded mb-2"
              style={{ maxWidth: "900px" }}
            >
              <div>
                <b>{name}</b>
                <div className="text-muted small">{id}</div>
              </div>

              <button
                className={`btn ${
                  statusMap[id] === "PRESENT"
                    ? "btn-success"
                    : "btn-danger"
                }`}
                onClick={() => toggle(id)}
              >
                {statusMap[id]}
              </button>
            </div>
          );
        })}

        {students.length > 0 && (
          <div className="mt-3">
            <button
              className="btn btn-primary"
              onClick={saveAttendance}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Attendance"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
