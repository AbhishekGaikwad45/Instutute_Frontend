import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import api from "../Api/axiosInstance"; // ✅ axios instance

export default function StudyMaterialsPage() {
  const student = JSON.parse(localStorage.getItem("student"));
  const studentId = student?.studentId;

  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= LOAD STUDENT BATCHES =================
  useEffect(() => {
    if (!studentId) return;

    const loadBatches = async () => {
      try {
        const res = await api.get(
          `/api/batch/student/${studentId}`
        );
        setBatches(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Batch fetch error:", err);
      }
    };

    loadBatches();
  }, [studentId]);

  // ================= LOAD MATERIALS =================
  const loadMaterials = async (batchCode) => {
    setSelectedBatch(batchCode);
    setLoading(true);

    try {
      const res = await api.get(
        `/api/file/batch/${batchCode}`
      );
      setMaterials(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Material fetch error:", err);
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">

      <h2 className="fw-bold mb-3">📚 Study Materials</h2>

      {/* ---------- Batch Selection ---------- */}
      <h5>Select Batch:</h5>

      <div className="d-flex gap-2 flex-wrap mb-4">
        {batches.length === 0 ? (
          <p className="text-muted">No batches assigned.</p>
        ) : (
          batches.map((b) => (
            <button
              key={b.batchCode}
              className={`btn ${
                selectedBatch === b.batchCode
                  ? "btn-primary"
                  : "btn-outline-primary"
              }`}
              onClick={() => loadMaterials(b.batchCode)}
            >
              {b.batchCode} — {b.batchName}
            </button>
          ))
        )}
      </div>

      {/* ---------- Study Material ---------- */}
      <h4 className="mb-3">
        {selectedBatch
          ? `Materials for ${selectedBatch}`
          : "Select a batch to view notes"}
      </h4>

      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : materials.length === 0 ? (
        <p className="text-muted">
          No study materials uploaded for this batch.
        </p>
      ) : (
        <div className="row">
          {materials.map((file) => (
            <div className="col-md-4 col-sm-6 mb-4" key={file.id}>
              <div className="card shadow-sm border-0">
                <div className="card-body text-center">

                  {/* IMAGE */}
                  {file.resourceType === "image" && (
                    <img
                      src={file.url}
                      className="img-fluid rounded mb-3"
                      alt={file.fileName}
                    />
                  )}

                  {/* VIDEO */}
                  {file.resourceType === "video" && (
                    <video controls className="w-100 rounded mb-3">
                      <source src={file.url} />
                    </video>
                  )}

                  {/* PDF / DOC */}
                  {file.resourceType === "raw" && (
                    <iframe
                      src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
                        file.url
                      )}`}
                      className="w-100 rounded mb-3"
                      style={{ height: "180px" }}
                      title={file.fileName}
                    ></iframe>
                  )}

                  <h6 className="fw-bold">{file.fileName}</h6>

                  <button
                    onClick={() =>
                      window.open(file.url, "_blank", "noopener,noreferrer")
                    }
                    className="btn btn-primary btn-sm w-100"
                  >
                    Open
                  </button>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
