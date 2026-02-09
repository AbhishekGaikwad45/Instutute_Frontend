import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import api from "../Api/axiosInstance"; // ✅ axios instance

export default function ViewUploadedFiles() {
  const user = JSON.parse(localStorage.getItem("user"));
  const faculty = user?.role === "faculty" ? user.data : null;
  const facultyId = faculty?.id;

  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // ⭐ FIX CLOUDINARY RAW DOC/DOCX URL
  const fixCloudinaryDocUrl = (url) => {
    return url.replace("/raw/upload/", "/upload/raw/");
  };

  const getType = (f) => {
    const url = f.url.toLowerCase();
    if (url.endsWith(".pdf")) return "pdf";
    if (url.match(/\.(doc|docx)$/)) return "doc";
    if (url.match(/\.(jpg|jpeg|png|gif)$/)) return "img";
    if (url.match(/\.(mp4|mov|avi)$/)) return "video";
    return "other";
  };

  useEffect(() => {
    if (!facultyId) {
      alert("Faculty not logged in!");
      return;
    }
    loadFacultyBatches();
    // eslint-disable-next-line
  }, []);

  // ================= LOAD FACULTY BATCHES =================
  const loadFacultyBatches = async () => {
    try {
      const res = await api.get(`/api/batch/by-faculty/${facultyId}`);
      const data = Array.isArray(res.data) ? res.data : [];
      setBatches(data);

      if (data.length > 0) {
        setSelectedBatch(data[0]);
        loadFiles(data[0].batchCode);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load batches");
    }
  };

  // ================= LOAD FILES =================
  const loadFiles = async (batchCode) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/file/batch/${batchCode}`);
      setFiles(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      alert("Failed to load materials");
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE FILE =================
  const deleteFile = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      setDeletingId(id);
      await api.delete(`/api/file/delete/${id}`);
      setFiles((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="fw-bold text-primary mb-3 text-center">
        📘 Study Materials (Faculty View)
      </h2>

      {/* BATCH BUTTONS */}
      <div className="d-flex gap-2 flex-wrap mb-4 justify-content-center">
        {batches.map((b) => (
          <button
            key={b.batchCode}
            className={`btn btn-sm px-3 ${
              selectedBatch?.batchCode === b.batchCode
                ? "btn-primary"
                : "btn-outline-primary"
            }`}
            onClick={() => {
              setSelectedBatch(b);
              loadFiles(b.batchCode);
            }}
          >
            {b.batchName} ({b.batchCode})
          </button>
        ))}
      </div>

      {selectedBatch && (
        <h4 className="text-success fw-semibold mb-4 text-center">
          Showing Notes for: {selectedBatch.batchName} (
          {selectedBatch.batchCode})
        </h4>
      )}

      {loading && (
        <h5 className="text-center text-warning">
          Loading materials...
        </h5>
      )}

      {!loading && files.length === 0 && (
        <h5 className="text-center text-danger">
          No study materials uploaded for this batch.
        </h5>
      )}

      <div className="row">
        {files.map((file) => {
          const type = getType(file);

          // ⭐ FINAL DOC URL FIX
          const fixedDocUrl =
            type === "doc"
              ? fixCloudinaryDocUrl(file.url)
              : file.url;

          // ⭐ GOOGLE DOCS VIEWER LINK
          const googleDocViewer =
            "https://docs.google.com/gview?embedded=true&url=" +
            encodeURIComponent(fixedDocUrl);

          return (
            <div className="col-md-4 col-sm-6 mb-4" key={file.id}>
              <div className="card shadow-sm border-0 h-100">
                {/* Preview */}
                <div
                  className="card-body text-center p-2"
                  style={{ height: "220px" }}
                >
                  {type === "pdf" && (
                    <iframe
                      title="pdf"
                      src={file.url}
                      className="w-100 h-100 border rounded"
                    ></iframe>
                  )}

                  {type === "doc" && (
                    <iframe
                      title="doc"
                      src={googleDocViewer}
                      className="w-100 h-100 border rounded"
                    ></iframe>
                  )}

                  {type === "img" && (
                    <img
                      src={file.url}
                      alt={file.fileName}
                      className="img-fluid h-100 w-100 rounded"
                      style={{ objectFit: "cover" }}
                    />
                  )}

                  {type === "video" && (
                    <video controls className="w-100 h-100 rounded">
                      <source src={file.url} />
                    </video>
                  )}
                </div>

                <div className="px-3">
                  <h6 className="fw-bold text-truncate">
                    {file.fileName}
                  </h6>
                </div>

                <div className="card-footer d-flex justify-content-between px-3 py-2">
                  {/* OPEN */}
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => {
                      if (type === "doc") {
                        window.open(
                          googleDocViewer,
                          "_blank",
                          "noopener,noreferrer"
                        );
                      } else {
                        window.open(
                          file.url,
                          "_blank",
                          "noopener,noreferrer"
                        );
                      }
                    }}
                  >
                    <i className="fas fa-eye me-1"></i> Open
                  </button>

                  {/* DELETE */}
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteFile(file.id)}
                  >
                    {deletingId === file.id ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      <i className="fas fa-trash"></i>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
