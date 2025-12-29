import React, { useEffect, useState } from "react";
import api from "../Api/axiosInstance"; 

export default function FacultyHome({ faculty, setPage }) {

  console.log("FACULTY OBJECT:", faculty); // ✅ HERE
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    if (faculty?.id) {
      loadBatches();
    }
  }, [faculty]);

  // ================= LOAD BATCHES =================
  const loadBatches = async () => {
    try {
      const res = await api.get(`/api/batch/by-faculty/${faculty.id}`);
      setBatches(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load batches", err);
      setBatches([]);
    }
  };

  // ================= NAVIGATION =================
  const openAttendance = (code) => {
    localStorage.setItem("selectedBatch", code);
    setPage("attendance");
  };

  const openHistory = (code) => {
    localStorage.setItem("selectedBatch", code);
    setPage("history");
  };

  return (
    <div className="container mt-4">
      {/* Title */}
      <h3 className="fw-bold mb-4 text-primary">
        <i className="bi bi-people-fill me-2"></i>Your Batches
      </h3>

      {/* No batch message */}
      {batches.length === 0 && (
        <div className="alert alert-info mt-4 shadow-sm">
          No batches assigned to you yet.
        </div>
      )}

      {/* Batch Cards */}
      <div className="row">
        {batches.map((b) => (
          <div className="col-md-6 col-lg-4 mb-4" key={b.batchCode}>
            <div
              className="card shadow-sm border-0 batch-card h-100"
              style={{ borderRadius: "14px" }}
            >
              <div className="card-body">
                {/* Batch Name */}
                <h5 className="card-title fw-bold text-dark">
                  {b.batchName}
                </h5>

                {/* Details */}
                <p className="text-muted small mb-1">
                  <i className="bi bi-clock me-1"></i>
                  {b.batchTiming}
                </p>

                <p className="text-muted small">
                  <i className="bi bi-hash me-1"></i>
                  Code: {b.batchCode}
                </p>

                {/* Buttons */}
                <div className="mt-3 d-flex justify-content-between">
                  <button
                    className="btn btn-primary btn-sm w-50 me-2"
                    onClick={() => openAttendance(b.batchCode)}
                  >
                    <i className="bi bi-list-check me-1"></i> Attendance
                  </button>

                  <button
                    className="btn btn-outline-secondary btn-sm w-50"
                    onClick={() => openHistory(b.batchCode)}
                  >
                    <i className="bi bi-clock-history me-1"></i> History
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hover CSS */}
      <style>{`
        .batch-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .batch-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 0.7rem 1.2rem rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
}
