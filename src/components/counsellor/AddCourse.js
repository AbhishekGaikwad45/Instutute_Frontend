import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../Api/axiosInstance"; // ✅ axios instance

export default function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    loadCourses();
  }, []);

  // ================= LOAD COURSES =================
  const loadCourses = async () => {
    try {
      const res = await api.get("/api/course/all");

      if (Array.isArray(res.data)) {
        setCourses(res.data);
      } else if (res.data?.data) {
        setCourses(res.data.data);
      } else {
        setCourses([]);
      }
    } catch {
      toast.error("Failed to load courses!");
      setCourses([]);
    }
  };

  // ================= ADD COURSE =================
  const saveCourse = async () => {
    if (!courseName.trim()) {
      return toast.error("Enter valid course name!");
    }

    try {
      await api.post("/api/course/add", { courseName });

      toast.success("Course Added Successfully!");
      setCourseName("");
      loadCourses();
    } catch {
      toast.error("Failed to add course");
    }
  };

  // ================= OPEN UPDATE MODAL =================
  const openUpdateModal = (course) => {
    setSelectedCourse(course);
    setEditName(course.courseName);
  };

  // ================= UPDATE COURSE =================
  const saveUpdate = async () => {
    try {
      await api.put(`/api/course/update/${selectedCourse.id}`, {
        courseName: editName,
      });

      toast.success("Course Updated!");
      loadCourses();
    } catch {
      toast.error("Update Failed!");
    }
  };

  // ================= DELETE COURSE =================
  const deleteCourse = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await api.delete(`/api/course/delete/${id}`);

      toast.success("Course Deleted!");
      loadCourses();
    } catch {
      toast.error("Delete Failed!");
    }
  };

  return (
    <div className="container mt-4 mb-5" style={{ maxWidth: "900px" }}>
      <div className="card shadow p-4">
        <h3 className="fw-bold mb-4 text-center">🎓 Course Management</h3>

        {/* ADD COURSE */}
        <div className="card p-3 mb-4">
          <h5 className="fw-bold mb-3">Add Course</h5>

          <label className="fw-semibold">Course Name</label>
          <input
            type="text"
            className="form-control mb-3"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />

          <button className="btn btn-primary w-100" onClick={saveCourse}>
            Add Course
          </button>
        </div>

        {/* COURSE LIST */}
        <div className="card p-3">
          <h5 className="fw-bold mb-3">All Courses</h5>

          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Course Name</th>
                <th style={{ width: "180px" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {courses.length > 0 ? (
                courses.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.courseName}</td>
                    <td className="d-flex gap-2">
                      <button
                        className="btn btn-warning btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#updateModal"
                        onClick={() => openUpdateModal(c)}
                      >
                        Update
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteCourse(c.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-3">
                    No Courses Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* UPDATE MODAL */}
      <div className="modal fade" id="updateModal" tabIndex="-1">
        <div className="modal-dialog mt-5">
          <div className="modal-content">
            <div className="modal-header bg-warning">
              <h5 className="modal-title fw-bold">Update Course</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              <label className="fw-semibold">Course Name</label>
              <input
                type="text"
                className="form-control"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-warning"
                data-bs-dismiss="modal"
                onClick={saveUpdate}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
