import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../Api/axiosInstance"; // ✅ common axios instance

export default function StudentPerformance({ studentId }) {
  const [testRecords, setTestRecords] = useState([]);
  const [projectRecords, setProjectRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // =============================
  // FETCH PERFORMANCE DATA
  // =============================
  useEffect(() => {
    if (!studentId) {
      setLoading(false);
      return;
    }

    const fetchPerformance = async () => {
      try {
        setLoading(true);

        // 🔹 PARALLEL API CALLS
        const [testRes, projectRes] = await Promise.all([
          api.get(`/api/marks/student/${studentId}/records`),
          api.get(`/api/project/student/${studentId}/records`)
        ]);

        setTestRecords(Array.isArray(testRes.data) ? testRes.data : []);
        setProjectRecords(Array.isArray(projectRes.data) ? projectRes.data : []);

      } catch (err) {
        console.error("Performance load error:", err);
        toast.error("Failed to load performance data!");
      } finally {
        setLoading(false);
      }
    };

    fetchPerformance();
  }, [studentId]);

  // =============================
  // LOADING / NO STUDENT
  // =============================
  if (!studentId) {
    return (
      <div className="text-center mt-5 text-danger">
        Student ID not found!
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" />
        <p className="mt-2">Loading performance...</p>
      </div>
    );
  }

  return (
    <div className="container">

      {/* ============================= */}
      {/* TEST RECORDS */}
      {/* ============================= */}
      <div className="card shadow p-4 mb-4">
        <h4 className="text-center mb-3">📊 Test Records</h4>

        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Test Title</th>
              <th>Date</th>
              <th>Marks</th>
              <th>Grade</th>
            </tr>
          </thead>

          <tbody>
            {testRecords.length > 0 ? (
              testRecords.map((t, idx) => (
                <tr key={idx}>
                  <td>{t.testTitle}</td>
                  <td>{t.testDate}</td>
                  <td>{t.marks}</td>
                  <td
                    className={
                      t.grade === "A" || t.grade === "A+"
                        ? "text-success fw-bold"
                        : t.grade === "Fail"
                        ? "text-danger fw-bold"
                        : "fw-semibold"
                    }
                  >
                    {t.grade}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  No Test Records Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ============================= */}
      {/* PROJECT RECORDS */}
      {/* ============================= */}
      <div className="card shadow p-4 mb-4">
        <h4 className="text-center mb-3">🧩 Project Records</h4>

        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Topic</th>
              <th>Technology</th>
              <th>Status</th>
              <th>Assigned Date</th>
              <th>Completed Date</th>
            </tr>
          </thead>

          <tbody>
            {projectRecords.length > 0 ? (
              projectRecords.map((p, idx) => (
                <tr key={idx}>
                  <td>{p.projectTopic}</td>
                  <td>{p.technology}</td>

                  <td
                    className={
                      p.status === "COMPLETED"
                        ? "text-success fw-bold"
                        : p.status === "IN_PROGRESS"
                        ? "text-primary fw-bold"
                        : "text-danger fw-bold"
                    }
                  >
                    {p.status.replace("_", " ")}
                  </td>

                  <td>{p.assignedDate}</td>
                  <td>{p.completedDate || "Not Completed"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No Project Records Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
