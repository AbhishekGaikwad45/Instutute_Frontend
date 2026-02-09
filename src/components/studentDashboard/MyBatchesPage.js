import React, { useEffect, useState } from "react";
import api from "../Api/axiosInstance";

export default function MyBatchesPage() {
  const student = JSON.parse(localStorage.getItem("student"));
  const studentId = student?.studentId;

  const [batches, setBatches] = useState([]);
  const [facultyMap, setFacultyMap] = useState({}); // facultyCode → name
  const [loading, setLoading] = useState(true);

  // ---------------- LOAD BATCHES ----------------
  useEffect(() => {
    if (studentId) loadBatches(studentId);
  }, [studentId]);

  const loadBatches = async (id) => {
    try {
      const res = await api.get(`/api/student/${id}/batches`);
      const data = Array.isArray(res.data) ? res.data : [];
      setBatches(data);

      // 🔥 fetch missing faculty names
      fetchFacultyNames(data);
    } catch (err) {
      console.error("Error loading batches:", err);
      setBatches([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- FETCH FACULTY NAMES ----------------
  const fetchFacultyNames = async (data) => {
    const uniqueCodes = [
      ...new Set(
        data
          .map((item) => item.batch?.facultyCode)
          .filter((code) => code)
      ),
    ];

    for (let code of uniqueCodes) {
      if (!facultyMap[code]) {
        try {
          const res = await api.get(`/api/faculty/${code}`);
          setFacultyMap((prev) => ({
            ...prev,
            [code]: res.data.name,
          }));
        } catch {
          setFacultyMap((prev) => ({
            ...prev,
            [code]: "Assigned",
          }));
        }
      }
    }
  };

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" />
        <h5 className="mt-2">Loading batches...</h5>
      </div>
    );
  }

  // ---------------- UI ----------------
  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-3">My Batches</h2>

      {batches.length === 0 && (
        <div className="alert alert-info text-center fs-5">
          No batches assigned yet.
        </div>
      )}

      <div className="row">
        {batches.map((item, index) => {
          const batch = item.batch;
          const faculty = item.faculty;

          // ✅ FINAL NAME LOGIC
          let facultyName = "Not Assigned";

          if (faculty?.name) {
            facultyName = faculty.name;
          } else if (batch?.facultyCode) {
            facultyName = facultyMap[batch.facultyCode] || "Loading...";
          }

          return (
            <div className="col-md-6 mb-4" key={index}>
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h4 className="fw-bold text-primary">
                    {batch?.batchName}{" "}
                    <span className="text-dark">
                      ({batch?.batchCode})
                    </span>
                  </h4>

                  <hr />

                  <p className="mb-1">
                    <b>Course:</b> {batch?.courseName}
                  </p>

                  <p className="mb-1">
                    <b>Timing:</b> {batch?.batchTiming}
                  </p>

                  <p className="mb-1">
                    <b>Faculty:</b>{" "}
                    <span className="fw-semibold text-success">
                      {facultyName}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
