import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../Api/axiosInstance"; // ✅ axios instance

export default function StudentProjectAdd() {
  const [form, setForm] = useState({
    studentId: "",
    studentName: "",
    projectTopic: "",
    technology: "",
    description: "",
    status: "NOT_STARTED",
    assignedDate: "",
    completedDate: "",
  });

  const [searchList, setSearchList] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // ---------------- HANDLE INPUT ----------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ---------------- 🔍 SEARCH STUDENT ----------------
  const searchStudent = async (text) => {
    setForm({ ...form, studentId: text });

    if (text.length < 2) {
      setShowDropdown(false);
      return;
    }

    try {
      const res = await api.get(`/api/student/search/${text}`);
      setSearchList(Array.isArray(res.data) ? res.data : []);
      setShowDropdown(true);
    } catch (err) {
      console.error("Search error:", err);
      setSearchList([]);
      setShowDropdown(false);
    }
  };

  // ---------------- SELECT STUDENT ----------------
  const selectStudent = (student) => {
    setForm({
      ...form,
      studentId: student.studentId,
      studentName: student.name, // ✅ save name
    });
    setShowDropdown(false);
  };

  // ---------------- SAVE PROJECT ----------------
  const saveProject = async () => {
    const { studentId, projectTopic, technology, assignedDate } = form;

    if (!studentId || !projectTopic || !technology || !assignedDate) {
      toast.error("Please fill all required fields!");
      return;
    }

    try {
      await api.post("/api/project/add", form);

      toast.success("Project Added Successfully!");

      // Reset form
      setForm({
        studentId: "",
        studentName: "",
        projectTopic: "",
        technology: "",
        description: "",
        status: "NOT_STARTED",
        assignedDate: "",
        completedDate: "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Server error! Try again.");
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "700px" }}>
      <h2 className="text-primary mb-3">Add Student Project</h2>

      {/* 🔍 STUDENT SEARCH */}
      <div className="position-relative">
        <input
          name="studentId"
          className="form-control mb-2"
          placeholder="Search Student by ID or Name..."
          value={form.studentId}
          onChange={(e) => searchStudent(e.target.value)}
          autoComplete="off"
        />

        {showDropdown && searchList.length > 0 && (
          <ul
            className="list-group position-absolute w-100"
            style={{ zIndex: 10, maxHeight: "150px", overflowY: "auto" }}
          >
            {searchList.map((s) => (
              <li
                key={s.studentId}
                className="list-group-item list-group-item-action"
                onClick={() => selectStudent(s)}
                style={{ cursor: "pointer" }}
              >
                {s.studentId} — {s.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Project Topic */}
      <input
        name="projectTopic"
        className="form-control mb-3"
        placeholder="Project Topic"
        value={form.projectTopic}
        onChange={handleChange}
      />

      {/* Technology */}
      <select
        name="technology"
        className="form-control mb-3"
        value={form.technology}
        onChange={handleChange}
        style={{ fontWeight: "600" }}
      >
        <option value="">Select Technology</option>
        <option value="MERN">MERN</option>
        <option value="React">React</option>
        <option value="Java">Java</option>
        <option value="Python">Python</option>
        <option value="Node.js">Node.js</option>
        <option value="Spring Boot">Spring Boot</option>
        <option value="Full Stack">Full Stack</option>
      </select>

      {/* Description */}
      <textarea
        name="description"
        className="form-control mb-3"
        placeholder="Project Description"
        rows="3"
        value={form.description}
        onChange={handleChange}
      />

      {/* Status */}
      <select
        name="status"
        className="form-control mb-3"
        value={form.status}
        onChange={handleChange}
        style={{ fontWeight: "600" }}
      >
        <option value="NOT_STARTED">Not Started</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="COMPLETED">Completed</option>
      </select>

      {/* Assigned Date */}
      <label><strong>Assigned Date</strong></label>
      <input
        name="assignedDate"
        type="date"
        className="form-control mb-3"
        value={form.assignedDate}
        onChange={handleChange}
      />

      {/* Completed Date */}
      <label><strong>Completed Date (optional)</strong></label>
      <input
        name="completedDate"
        type="date"
        className="form-control mb-3"
        value={form.completedDate}
        onChange={handleChange}
      />

      <button className="btn btn-primary w-100" onClick={saveProject}>
        Save Project
      </button>
    </div>
  );
}
