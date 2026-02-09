import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import api from "../Api/axiosInstance"; // ✅ axios instance

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  const [faculty, setFaculty] = useState([]);
  const [batches, setBatches] = useState([]);
  const [courseList, setCourseList] = useState([]);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    loadStudents();
    loadFaculty();
    loadBatches();
    loadCourses();
  }, []);

  // ================= LOADERS =================
  const loadStudents = async () => {
    try {
      const res = await api.get("/api/student/all");
      setStudents(res.data);
      setFilteredStudents(res.data);
    } catch {
      toast.error("Failed to load students!");
    }
  };

  const loadFaculty = async () => {
    try {
      const res = await api.get("/api/faculty/all");
      setFaculty(res.data);
    } catch {
      toast.error("Failed to load faculty!");
    }
  };

  const loadBatches = async () => {
    try {
      const res = await api.get("/api/batch/all");
      setBatches(res.data);
    } catch {
      toast.error("Failed to load batches!");
    }
  };

  const loadCourses = async () => {
    try {
      const res = await api.get("/api/course/all");

      const normalized = res.data.map((c) =>
        typeof c === "string" ? c : c.name || c.courseName
      );

      setCourseList([...new Set(normalized)].filter(Boolean));
    } catch {
      // fallback from batches
      const fallback = [...new Set(batches.map((b) => b.courseName))];
      setCourseList(fallback);
    }
  };

  // ================= FILTERS =================
  const showAllStudents = () => setFilteredStudents(students);

  const filterByBatch = (batchCode) =>
    setFilteredStudents(
      students.filter((s) => s.batchCode === batchCode)
    );

  const filterByCourse = (course) =>
    setFilteredStudents(
      students.filter((s) => s.courseEnrolledFor === course)
    );

  const filterByFaculty = (facultyId) =>
    setFilteredStudents(
      students.filter(
        (s) =>
          s.assignedFacultyCode === facultyId ||
          s.assignedFacultyId === facultyId
      )
    );

  // ================= UPDATE =================
  const openUpdateModal = async (student) => {
    try {
      const res = await api.get(
        `/api/student/by-id/${student.studentId}`
      );

      setSelectedStudent(res.data);
      setEditForm(res.data);
    } catch {
      toast.error("Failed to load student details!");
    }
  };

  const handleEdit = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveUpdatedStudent = async () => {
    try {
      const id = selectedStudent.studentId;

      await api.put(`/api/student/update/${id}`, editForm);

      toast.success("Student updated successfully!");
      loadStudents();
    } catch {
      toast.error("Update failed!");
    }
  };

  // ================= DELETE =================
  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure to delete?")) return;

    try {
      await api.delete(`/api/student/delete/${id}`);
      toast.success("Student deleted!");
      loadStudents();
    } catch {
      toast.error("Delete failed!");
    }
  };

  return (
    <>
      <div className="container mt-4 mb-5">
        <div className="card shadow p-4">
          <h3 className="fw-bold mb-4">All Students</h3>

          {/* FILTERS */}
          <div className="d-flex gap-3 mb-4">
            <button className="btn btn-secondary" onClick={showAllStudents}>
              ALL
            </button>

            {/* Batch */}
            <div className="dropdown">
              <button
                className="btn btn-outline-primary dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                Batch
              </button>
              <ul className="dropdown-menu">
                {batches.map((b) => (
                  <li key={b.batchCode}>
                    <button
                      className="dropdown-item"
                      onClick={() => filterByBatch(b.batchCode)}
                    >
                      {b.batchName} ({b.batchCode})
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Course */}
            <div className="dropdown">
              <button
                className="btn btn-outline-warning dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                Course
              </button>
              <ul className="dropdown-menu">
                {courseList.map((c) => (
                  <li key={c}>
                    <button
                      className="dropdown-item"
                      onClick={() => filterByCourse(c)}
                    >
                      {c}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Faculty */}
            <div className="dropdown">
              <button
                className="btn btn-outline-success dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                Faculty
              </button>
              <ul className="dropdown-menu">
                {faculty.map((f) => (
                  <li key={f.id}>
                    <button
                      className="dropdown-item"
                      onClick={() =>
                        filterByFaculty(f.facultyCode || f.id)
                      }
                    >
                      {f.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* TABLE */}
          <table className="table table-bordered mt-3">
            <thead className="table-dark">
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Course</th>
                <th>Batch</th>
                <th>Faculty</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map((s) => (
                <tr key={s.studentId}>
                  <td>{s.studentId}</td>
                  <td>{s.name}</td>
                  <td>{s.mobile}</td>
                  <td>{s.courseEnrolledFor}</td>
                  <td>{s.batchCode}</td>
                  <td>{s.assignedFacultyName}</td>

                  <td className="d-flex gap-2">
                    <button
                      className="btn btn-warning btn-sm"
                      data-bs-toggle="modal"
                      data-bs-target="#updateModal"
                      onClick={() => openUpdateModal(s)}
                    >
                      Update
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteStudent(s.studentId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* UPDATE MODAL */}
        <div className="modal fade" id="updateModal" tabIndex="-1">
          <div className="modal-dialog modal-dialog-scrollable mt-5">
            <div className="modal-content">
              <div className="modal-header bg-warning">
                <h5 className="modal-title">Update Student</h5>
                <button className="btn-close" data-bs-dismiss="modal"></button>
              </div>

              <div className="modal-body">
                {selectedStudent &&
                  Object.keys(editForm).map((key) => (
                    <div className="mb-2" key={key}>
                      <label className="fw-semibold">
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .toUpperCase()}
                      </label>

                      <input
                        type={
                          key.toLowerCase().includes("date")
                            ? "date"
                            : "text"
                        }
                        name={key}
                        className="form-control"
                        value={editForm[key] || ""}
                        onChange={handleEdit}
                      />
                    </div>
                  ))}
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-warning"
                  data-bs-dismiss="modal"
                  onClick={saveUpdatedStudent}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" />
    </>
  );
}
