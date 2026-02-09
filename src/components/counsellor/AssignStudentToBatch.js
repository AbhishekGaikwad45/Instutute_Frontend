import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import api from "../Api/axiosInstance"; // ✅ your axios instance

export default function AssignStudent() {
  const [studentId, setStudentId] = useState("");
  const [batchCode, setBatchCode] = useState("");

  const [studentValid, setStudentValid] = useState(false);
  const [batchValid, setBatchValid] = useState(false);

  // ----------------------------------------
  // VALIDATION REGEX
  // ----------------------------------------
  const isFullBatchCode = (code) => /^[A-Za-z]{3}-\d{3,}$/.test(code);
  const isFullStudentId = (code) => /^[A-Za-z]{3}-ST-\d{3}$/.test(code);

  // ----------------------------------------
  // FETCH BATCH DETAILS
  // ----------------------------------------
  const fetchBatch = async (code) => {
    setBatchCode(code);

    if (!isFullBatchCode(code)) {
      setBatchValid(false);
      return;
    }

    try {
      const res = await api.get(`/api/batch/code/${code}`);
      toast.success(`Batch Found: ${res.data.batch.batchName}`);
      setBatchValid(true);
    } catch {
      toast.error("Batch Not Found!");
      setBatchValid(false);
    }
  };

  // ----------------------------------------
  // FETCH STUDENT DETAILS
  // ----------------------------------------
  const fetchStudent = async (code) => {
    setStudentId(code);

    if (!isFullStudentId(code)) {
      setStudentValid(false);
      return;
    }

    try {
      const res = await api.get(`/api/student/by-id/${code}`);
      toast.success(`Student Found: ${res.data.name}`);
      setStudentValid(true);
    } catch {
      toast.error("Student Not Found!");
      setStudentValid(false);
    }
  };

  // ----------------------------------------
  // ASSIGN STUDENT
  // ----------------------------------------
  const assign = async () => {
    if (!studentValid || !batchValid) {
      toast.error("Enter valid Student ID & Batch Code!");
      return;
    }

    try {
      const res = await api.post(
        `/api/batch/assign-student/${batchCode}`,
        { studentId }
      );

      toast.success("Student Assigned Successfully!");
      setStudentId("");
      setBatchCode("");
      setStudentValid(false);
      setBatchValid(false);
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Failed to assign student!"
      );
    }
  };

  return (
    <>
      <div className="container mt-4">
        <div
          className="card shadow p-4"
          style={{ maxWidth: "500px", margin: "auto" }}
        >
          <h3 className="text-center fw-bold mb-3">
            Assign Student to Batch
          </h3>

          {/* Student ID */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Student ID</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ex: NOV-ST-001"
              value={studentId}
              onChange={(e) =>
                fetchStudent(e.target.value.toUpperCase())
              }
              onPaste={(e) => {
                e.preventDefault();
                const text = e.clipboardData
                  .getData("text")
                  .toUpperCase();
                fetchStudent(text);
              }}
            />
          </div>

          {/* Batch Code */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Batch Code</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ex: NOV-975"
              value={batchCode}
              onChange={(e) =>
                fetchBatch(e.target.value.toUpperCase())
              }
              onPaste={(e) => {
                e.preventDefault();
                const text = e.clipboardData
                  .getData("text")
                  .toUpperCase();
                fetchBatch(text);
              }}
            />
          </div>

          <button
            className="btn btn-primary w-100"
            onClick={assign}
            disabled={!studentValid || !batchValid}
          >
            Assign Student
          </button>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={1500} />
    </>
  );
}
