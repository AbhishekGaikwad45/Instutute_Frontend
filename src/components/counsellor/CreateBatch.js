import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function BatchManagement() {
  const emptyForm = {
    batchName: "",
    courseName: "",
    batchTiming: "",
    startDate: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [batchList, setBatchList] = useState([]);
  const [courseList, setCourseList] = useState([]);

  const [selectedBatch, setSelectedBatch] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);

  // SEARCH
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    loadCourses();
    loadBatches();
  }, []);

  // LOAD COURSES
  const loadCourses = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/course/all");
      const data = await res.json();

      if (Array.isArray(data)) setCourseList(data);
    } catch (err) {
      toast.error("Failed to load courses");
    }
  };

  // LOAD BATCHES
  const loadBatches = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/batch/all");
      const data = await res.json();
      setBatchList(data);
    } catch (err) {
      toast.error("Failed to load batches");
    }
  };

  // HANDLE ADD FORM
  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // HANDLE EDIT FORM
  const handleEdit = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // SAVE NEW BATCH
  const saveBatch = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/batch/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("Batch Created! Code: " + data.batchCode);
        setForm(emptyForm);
        loadBatches();
      } else {
        toast.error("Failed to create batch");
      }
    } catch (err) {
      toast.error("Server Error while saving batch");
    }
  };

  // OPEN UPDATE MODAL
  const openUpdateModal = (batch) => {
    setSelectedBatch(batch);
    setEditForm(batch);
  };

  // SAVE UPDATED BATCH
  const updateBatch = async () => {
    try {
      const code = selectedBatch.batchCode;

      const res = await fetch(
        `http://localhost:8080/api/batch/update/${code}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editForm),
        }
      );

      if (res.ok) {
        toast.success("Batch Updated Successfully!");
        loadBatches();
      } else {
        toast.error("Update Failed!");
      }
    } catch (err) {
      toast.error("Server Error while updating batch");
    }
  };

  // DELETE BATCH
  const deleteBatch = async (code) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/batch/delete/${code}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        toast.success("Batch Deleted!");
        loadBatches();
      } else {
        toast.error("Delete Failed!");
      }
    } catch (err) {
      toast.error("Server Error while deleting batch");
    }
  };

  // 🔥 FILTERED BATCH LIST FOR SEARCH
  const filteredBatchList = batchList.filter((b) => {
    const val = searchText.toLowerCase();
    return (
      b.batchCode.toLowerCase().includes(val) ||
      b.batchName.toLowerCase().includes(val) ||
      b.courseName.toLowerCase().includes(val) ||
      b.batchTiming.toLowerCase().includes(val)
    );
  });

  return (
    <>
      <div className="container mt-4">
        <div
          className="card shadow p-4"
          style={{ maxWidth: "900px", margin: "auto" }}
        >
          <h2 className="text-center fw-bold mb-4">Batch Management</h2>

          {/* ADD BATCH */}
          <div className="card p-3 mb-4">
            <h4 className="fw-bold mb-3">Add New Batch</h4>

            <div className="mb-3">
              <label className="form-label fw-semibold">Batch Name</label>
              <input
                name="batchName"
                type="text"
                className="form-control"
                value={form.batchName}
                onChange={handle}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Course Name</label>
              <select
                name="courseName"
                className="form-select"
                value={form.courseName}
                onChange={handle}
              >
                <option value="">Select Course</option>
                {courseList.map((c) => (
                  <option key={c.id} value={c.courseName}>
                    {c.courseName}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Batch Timing</label>
              <input
                name="batchTiming"
                type="text"
                className="form-control"
                value={form.batchTiming}
                onChange={handle}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Start Date</label>
              <input
                name="startDate"
                type="date"
                className="form-control"
                value={form.startDate}
                onChange={handle}
              />
            </div>

            <button className="btn btn-primary w-100" onClick={saveBatch}>
              Create Batch
            </button>
          </div>

          {/* ALL BATCHES */}
          <div className="card p-3">
            <h4 className="fw-bold mb-3">All Batches</h4>

            {/* 🔍 SEARCH BAR */}
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Search Batch..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

            <table className="table table-bordered text-center">
              <thead className="table-dark">
                <tr>
                  <th>Batch Code</th>
                  <th>Batch Name</th>
                  <th>Course</th>
                  <th>Timing</th>
                  <th>Start Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredBatchList.map((b) => (
                  <tr key={b.batchCode}>
                    <td>{b.batchCode}</td>
                    <td>{b.batchName}</td>
                    <td>{b.courseName}</td>
                    <td>{b.batchTiming}</td>
                    <td>{b.startDate}</td>

                    <td className="d-flex justify-content-center gap-2">
                      <button
                        className="btn btn-warning btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#updateModal"
                        onClick={() => openUpdateModal(b)}
                      >
                        Update
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteBatch(b.batchCode)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredBatchList.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-3 text-muted">
                      No batches found
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
                <h5 className="modal-title">Update Batch</h5>
                <button className="btn-close" data-bs-dismiss="modal"></button>
              </div>

              <div className="modal-body">
                <label className="fw-semibold">Batch Name</label>
                <input
                  type="text"
                  className="form-control mb-2"
                  name="batchName"
                  value={editForm.batchName}
                  onChange={handleEdit}
                />

                <label className="fw-semibold">Course Name</label>
                <input
                  type="text"
                  className="form-control mb-2"
                  name="courseName"
                  value={editForm.courseName}
                  onChange={handleEdit}
                />

                <label className="fw-semibold">Batch Timing</label>
                <input
                  type="text"
                  className="form-control mb-2"
                  name="batchTiming"
                  value={editForm.batchTiming}
                  onChange={handleEdit}
                />

                <label className="fw-semibold">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="startDate"
                  value={editForm.startDate}
                  onChange={handleEdit}
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-warning"
                  data-bs-dismiss="modal"
                  onClick={updateBatch}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>

        <ToastContainer position="top-right" />
      </div>
    </>
  );
}
