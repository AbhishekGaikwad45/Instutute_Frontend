import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../Api/axiosInstance"; // ✅ axios instance

export default function CreateTest() {
  const [batches, setBatches] = useState([]);
  const [batchCode, setBatchCode] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

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
      toast.error("Failed to load Batches!");
      setBatches([]);
    }
  };

  // ================= CREATE TEST =================
  const createTest = async () => {
    if (!batchCode || !title.trim() || !date) {
      toast.error("All fields are required!");
      return;
    }

    const body = {
      batch: { batchCode },
      title: title.trim(),
      testDate: date,
    };

    try {
      await api.post("/api/test/add", body);

      toast.success("Test Created Successfully!");
      setBatchCode("");
      setTitle("");
      setDate("");
    } catch (err) {
      console.error(err);
      toast.error("Error creating test!");
    }
  };

  return (
    <div className="container mt-4 p-4 shadow rounded bg-white">
      <h2 className="mb-4 text-primary">Create Test</h2>

      {/* Batch Dropdown */}
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
              {b.batchCode} ({b.technologyName})
            </option>
          ))}
        </select>
      </div>

      {/* Test Title */}
      <div className="mb-3">
        <label className="form-label">Test Title</label>
        <input
          type="text"
          className="form-control"
          placeholder="Mock Test 1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Test Date */}
      <div className="mb-3">
        <label className="form-label">Test Date</label>
        <input
          type="date"
          className="form-control"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <button className="btn btn-primary w-100" onClick={createTest}>
        Create Test
      </button>
    </div>
  );
}
