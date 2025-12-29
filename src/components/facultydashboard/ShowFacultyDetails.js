import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../Api/axiosInstance"; // ✅ axios instance

export default function ShowFacultyDetails() {
  const [faculty, setFaculty] = useState([]);
  const [search, setSearch] = useState("");
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    loadFaculty();
  }, []);

  // ================= LOAD FACULTY =================
  const loadFaculty = async () => {
    try {
      const res = await api.get("/api/faculty/all");
      setFaculty(res.data);
      console.log("Faculty Loaded Successfully!");
    } catch {
      toast.error("Failed to load faculty!");
    }
  };

  // ================= SEARCH FILTER =================
  const filteredFaculty = faculty.filter((f) => {
    return (
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.email.toLowerCase().includes(search.toLowerCase()) ||
      (f.facultyCode || "").toLowerCase().includes(search.toLowerCase())
    );
  });

  // ================= OPEN UPDATE MODAL =================
  const openEditModal = (fac) => {
    setEditForm(fac);
  };

  const handleEdit = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // ================= UPDATE FACULTY =================
  const updateFaculty = async () => {
    try {
      await api.put(
        `/api/faculty/update/${editForm.facultyCode}`,
        editForm
      );

      toast.success("Faculty Updated Successfully!");
      loadFaculty();
    } catch {
      toast.error("Update Failed!");
    }
  };

  // ================= DELETE FACULTY =================
  const deleteFaculty = async (code) => {
    if (!window.confirm("Are you sure to delete this faculty?")) return;

    try {
      await api.delete(`/api/faculty/delete/${code}`);
      toast.success("Faculty Deleted!");
      loadFaculty();
    } catch {
      toast.error("Delete Failed!");
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow p-4">
        <h3 className="fw-bold mb-3">Faculty List</h3>

        {/* SEARCH BAR */}
        <div className="row mb-3">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, email, faculty code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* FACULTY TABLE */}
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Faculty Code</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredFaculty.map((f, index) => (
              <tr key={f.id}>
                <td>{index + 1}</td>
                <td>{f.name}</td>
                <td>{f.email}</td>
                <td>{f.mobile}</td>
                <td>{f.facultyCode}</td>

                <td className="d-flex gap-2 justify-content-center">
                  <button
                    className="btn btn-sm btn-warning"
                    data-bs-toggle="modal"
                    data-bs-target="#editModal"
                    onClick={() => openEditModal(f)}
                  >
                    Update
                  </button>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteFaculty(f.facultyCode)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {filteredFaculty.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center">
                  No faculty found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= UPDATE MODAL ================= */}
      <div className="modal fade" id="editModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-lg mt-5">
          <div className="modal-content">
            <div className="modal-header bg-warning">
              <h5 className="modal-title fw-bold">Update Faculty</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              {editForm &&
                Object.keys(editForm).map((key) =>
                  key !== "id" && key !== "facultyCode" ? (
                    <div className="mb-3" key={key}>
                      <label className="fw-semibold">
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .toUpperCase()}
                      </label>

                      <input
                        type={key.includes("Date") ? "date" : "text"}
                        name={key}
                        className="form-control"
                        value={editForm[key] || ""}
                        onChange={handleEdit}
                      />
                    </div>
                  ) : null
                )}
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-warning fw-bold"
                data-bs-dismiss="modal"
                onClick={updateFaculty}
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
