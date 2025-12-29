import React, { useEffect, useState } from "react";
import api from "../Api/axiosInstance"; // ✅ axios instance

export default function UploadMarks() {
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [tests, setTests] = useState([]);

  const [batchCode, setBatchCode] = useState("");
  const [studentId, setStudentId] = useState("");
  const [testId, setTestId] = useState("");
  const [marks, setMarks] = useState("");
  const [grade, setGrade] = useState("");
  const [msg, setMsg] = useState("");

  // ================= LOAD BATCHES =================
  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    try {
      const res = await api.get("/api/batch/all");
      setBatches(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setBatches([]);
    }
  };

  // ================= LOAD STUDENTS & TESTS =================
  useEffect(() => {
    if (!batchCode) {
      setStudents([]);
      setTests([]);
      return;
    }

    loadStudents(batchCode);
    loadTests(batchCode);
  }, [batchCode]);

  const loadStudents = async (code) => {
    try {
      const res = await api.get(`/api/student/by-batch/${code}`);
      setStudents(Array.isArray(res.data) ? res.data : []);
    } catch {
      setStudents([]);
    }
  };

  const loadTests = async (code) => {
    try {
      const res = await api.get(`/api/test/by-batch/${code}`);
      setTests(Array.isArray(res.data) ? res.data : []);
    } catch {
      setTests([]);
    }
  };

  // ================= UPLOAD MARKS =================
  const uploadMarks = async () => {
    if (!studentId || !testId || !marks) {
      setMsg("All fields required!");
      return;
    }

    const body = {
      studentId,
      test: { id: Number(testId) },
      marks: Number(marks),
      grade,
    };

    try {
      await api.post("/api/marks/add", body);

      setMsg("Marks Uploaded Successfully!");
      setStudentId("");
      setMarks("");
      setGrade("");
      setTestId("");
    } catch (err) {
      console.error(err);
      setMsg("Error uploading marks");
    }
  };

  return (
    <div className="container mt-4 p-4 shadow bg-white rounded">
      <h2 className="text-primary mb-4">
        Upload Marks (Batch Wise)
      </h2>

      {msg && <div className="alert alert-info">{msg}</div>}

      {/* Batch */}
      <div className="mb-3">
        <label className="form-label">Select Batch</label>
        <select
          className="form-select"
          value={batchCode}
          onChange={(e) => setBatchCode(e.target.value)}
        >
          <option value="">Select Batch</option>
          {batches.map((b) => (
            <option key={b.batchCode} value={b.batchCode}>
              {b.batchCode}
            </option>
          ))}
        </select>
      </div>

      {/* Student */}
      <div className="mb-3">
        <label className="form-label">Select Student</label>
        <select
          className="form-select"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        >
          <option value="">Select Student</option>
          {students.map((s) => (
            <option key={s.studentId} value={s.studentId}>
              {s.name} ({s.studentId})
            </option>
          ))}
        </select>
      </div>

      {/* Tests */}
      <div className="mb-3">
        <label className="form-label">Select Test</label>
        <select
          className="form-select"
          value={testId}
          onChange={(e) => setTestId(e.target.value)}
        >
          <option value="">Select Test</option>
          {tests.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title} ({t.testDate})
            </option>
          ))}
        </select>
      </div>

      {/* Marks */}
      <div className="mb-3">
        <label className="form-label">Marks</label>
        <input
          type="number"
          className="form-control"
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
          placeholder="Enter Marks"
        />
      </div>

      {/* Grade */}
      <div className="mb-3">
        <label className="form-label">Grade</label>
        <select
          className="form-select"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
        >
          <option value="">Select Grade</option>
          <option value="A+">A+</option>
          <option value="A">A</option>
          <option value="B+">B+</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="Fail">Fail</option>
        </select>
      </div>

      <button className="btn btn-primary w-100" onClick={uploadMarks}>
        Upload Marks
      </button>
    </div>
  );
}
