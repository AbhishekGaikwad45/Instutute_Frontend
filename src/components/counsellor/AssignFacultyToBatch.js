import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import api from "../Api/axiosInstance";

export default function AssignFacultyToBatch() {

  const [facultyCode, setFacultyCode] = useState("");
  const [batchCode, setBatchCode] = useState("");

  const [batchValid, setBatchValid] = useState(false);
  const [facultyValid, setFacultyValid] = useState(false);

  const [currentBatch, setCurrentBatch] = useState(null);
  const [newFacultyCode, setNewFacultyCode] = useState("");

  // ---------------- VALIDATION ----------------
  const isFullBatchCode = (code) => /^[A-Z]{3}-\d{3,}$/.test(code);
  const isFullFacultyCode = (code) => /^[A-Z]{3}-\d{3,}$/.test(code);

  // ---------------- FETCH BATCH ----------------
  const fetchBatch = async (code) => {
    setBatchCode(code);
    setCurrentBatch(null);

    if (!isFullBatchCode(code)) {
      setBatchValid(false);
      return;
    }

    try {
      const res = await api.get(`/api/batch/code/${code}`);
      setCurrentBatch(res.data);

      toast.success(`Batch Found: ${res.data.batch.batchName}`);
      setBatchValid(true);
    } catch {
      toast.error("Batch Not Found!");
      setBatchValid(false);
    }
  };

  // ---------------- FETCH FACULTY (ASSIGN) ----------------
  const fetchFaculty = async (code) => {
    setFacultyCode(code);

    if (!isFullFacultyCode(code)) {
      setFacultyValid(false);
      return;
    }

    try {
      const res = await api.get(`/api/faculty/${code}`);
      toast.success(`Faculty Found: ${res.data.name}`);
      setFacultyValid(true);
    } catch {
      toast.error("Faculty Not Found!");
      setFacultyValid(false);
    }
  };

  // ---------------- ASSIGN FACULTY ----------------
  const assignFaculty = async () => {
    if (!batchValid || !facultyValid) {
      toast.error("Enter valid Batch & Faculty Code!");
      return;
    }

    try {
      await api.post("/api/batch/assign-faculty", {
        batchCode,
        facultyCode,
      });

      toast.success("🎉 Faculty Assigned Successfully!");
      setFacultyCode("");
      setBatchCode("");
      setBatchValid(false);
      setFacultyValid(false);
    } catch {
      toast.error("Assignment failed!");
    }
  };

  // ---------------- REASSIGN FACULTY ----------------
  const reassignFaculty = async () => {
    if (!isFullFacultyCode(newFacultyCode)) {
      toast.error("Enter valid new Faculty Code");
      return;
    }

    try {
      await api.post("/api/batch/reassign-faculty", {
        batchCode,
        facultyCode: newFacultyCode,
      });

      toast.success("🎉 Faculty Reassigned Successfully!");
      setNewFacultyCode("");
    } catch {
      toast.error("Reassign failed!");
    }
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <div className="card shadow p-4" style={{ width: "400px" }}>
          <h3 className="text-center mb-4 fw-bold text-primary">
            Assign Faculty to Batch
          </h3>

          {/* Batch Code */}
          <div className="mb-3">
            <label className="fw-semibold">Batch Code</label>
            <input
              className="form-control"
              placeholder="NOV-975"
              value={batchCode}
              onChange={(e) => fetchBatch(e.target.value.toUpperCase())}
            />
          </div>

          {/* Faculty Code */}
          <div className="mb-3">
            <label className="fw-semibold">Faculty Code</label>
            <input
              className="form-control"
              placeholder="FAC-001"
              value={facultyCode}
              onChange={(e) => fetchFaculty(e.target.value.toUpperCase())}
            />
          </div>

          {/* ASSIGN BUTTON */}
          <button
            className="btn btn-primary w-100 mb-2"
            onClick={assignFaculty}
            disabled={!batchValid || !facultyValid}
          >
            Assign Faculty
          </button>

          {/* UPDATE BUTTON */}
          <button
            className="btn btn-warning w-100"
            data-bs-toggle="modal"
            data-bs-target="#updateModal"
            disabled={!currentBatch?.faculty}
          >
            Update Faculty to Batch
          </button>
        </div>
      </div>

      {/* ================= UPDATE MODAL ================= */}
      <div className="modal fade" id="updateModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-warning">
              <h5 className="modal-title fw-bold">Reassign Faculty</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              <p><b>Batch:</b> {currentBatch?.batch?.batchName}</p>
              <p>
                <b>Current Faculty:</b>{" "}
                <span className="text-success fw-bold">
                  {currentBatch?.faculty?.name}
                </span>
              </p>

              <label className="fw-semibold mt-2">New Faculty Code</label>
              <input
                className="form-control"
                placeholder="FAC-006"
                value={newFacultyCode}
                onChange={(e) =>
                  setNewFacultyCode(e.target.value.toUpperCase())
                }
              />
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-warning fw-bold"
                onClick={reassignFaculty}
                data-bs-dismiss="modal"
              >
                Update Faculty
              </button>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={1500} />
    </>
  );
}
