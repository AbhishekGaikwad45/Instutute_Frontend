import React, { useEffect, useState } from "react";
import api from "../Api/axiosInstance";

export default function AddBatch() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [batch, setBatch] = useState({
    batchName: "",
    courseName: "",
    batchTiming: "",
    startDate: "",
  });

  // 🔹 Load courses when page loads
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/api/course/all");
      setCourses(res.data);
    } catch (error) {
      console.error("Failed to fetch courses", error);
      alert("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setBatch({ ...batch, [e.target.name]: e.target.value });
  };

  // ================= CREATE BATCH =================
  const saveBatch = async () => {
    if (
      !batch.batchName ||
      !batch.courseName ||
      !batch.batchTiming ||
      !batch.startDate
    ) {
      alert("Please fill all fields!");
      return;
    }

    try {
      const res = await api.post("/api/batch/add", batch);
      alert("Batch Created! Code: " + res.data.batchCode);

      // Reset form
      setBatch({
        batchName: "",
        courseName: "",
        batchTiming: "",
        startDate: "",
      });
    } catch (error) {
      console.error("Create batch error", error);
      alert("Error creating batch");
    }
  };

  return (
    <div className="container mt-4">
      <div
        className="card shadow p-4"
        style={{ maxWidth: "600px", margin: "auto" }}
      >
        <h3 className="text-center fw-bold mb-3">Create Batch</h3>

        {/* Batch Name */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Batch Name</label>
          <input
            type="text"
            name="batchName"
            className="form-control"
            placeholder="Enter batch name"
            value={batch.batchName}
            onChange={handleChange}
          />
        </div>

        {/* Course Dropdown */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Course</label>

          {loading ? (
            <div className="text-muted">Loading courses...</div>
          ) : (
            <select
              name="courseName"
              className="form-control"
              value={batch.courseName}
              onChange={handleChange}
            >
              <option value="">-- Select Course --</option>
              {courses.map((course) => (
                <option
                  key={course.id || course.courseId}
                  value={course.courseName}
                >
                  {course.courseName}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Batch Timing */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Batch Timing</label>
          <input
            type="text"
            name="batchTiming"
            className="form-control"
            placeholder="Ex: 7 PM - 9 PM"
            value={batch.batchTiming}
            onChange={handleChange}
          />
        </div>

        {/* Start Date */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Start Date</label>
          <input
            type="date"
            name="startDate"
            className="form-control"
            value={batch.startDate}
            onChange={handleChange}
          />
        </div>

        {/* Submit */}
        <button className="btn btn-primary w-100" onClick={saveBatch}>
          Create Batch
        </button>
      </div>
    </div>
  );
}
