import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../Api/axiosInstance"; // ✅ axios instance

export default function UploadStudyMaterial() {
  const [query, setQuery] = useState("");
  const [searchList, setSearchList] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // 🔍 SEARCH BATCH
  const searchBatch = async (text) => {
    setQuery(text);

    if (!text.trim()) {
      setSearchList([]);
      return;
    }

    try {
      const res = await api.get("/api/batch/search", {
        params: { query: text },
      });
      setSearchList(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Search Error:", err);
      setSearchList([]);
    }
  };

  // ✔ SELECT BATCH
  const selectBatch = (batch) => {
    setSelectedBatch(batch);
    setQuery(`${batch.batchCode} — ${batch.batchName}`);
    setSearchList([]);
  };

  // 📤 UPLOAD FILE
  const uploadFile = async () => {
    if (!selectedBatch) {
      toast.error("Please select a batch!");
      return;
    }

    if (!file) {
      toast.error("Please choose a file!");
      return;
    }

    setUploading(true);

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("batchCode", selectedBatch.batchCode);

      await api.post("/api/file/upload", fd);

      toast.success("File uploaded successfully!");
      setFile(null);
    } catch (e) {
      console.error(e);
      toast.error("Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "700px" }}>
      <div className="card shadow p-4 border-0">
        <h3 className="text-primary fw-bold mb-4">
          Upload Study Material (Batch Wise)
        </h3>

        {/* 🔍 Search Batch */}
        <label className="form-label fw-bold">Search Batch</label>
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Type batch code or batch name…"
          value={query}
          onChange={(e) => searchBatch(e.target.value)}
        />

        {/* AUTO-SUGGEST BOX */}
        {searchList.length > 0 && (
          <div
            className="list-group mt-1 shadow-sm"
            style={{ maxHeight: "200px", overflowY: "auto" }}
          >
            {searchList.map((b, i) => (
              <button
                key={i}
                type="button"
                className="list-group-item list-group-item-action"
                onClick={() => selectBatch(b)}
              >
                <b>{b.batchCode}</b> — {b.batchName}
              </button>
            ))}
          </div>
        )}

        {/* SELECTED BATCH */}
        {selectedBatch && (
          <div className="alert alert-info mt-3">
            <b>Selected Batch:</b> {selectedBatch.batchCode} <br />
            <b>Batch Name:</b> {selectedBatch.batchName}
          </div>
        )}

        {/* FILE INPUT */}
        <div className="mt-4">
          <label className="form-label fw-bold">Select File</label>
          <input
            type="file"
            className="form-control"
            accept=".pdf,.ppt,.pptx,.doc,.docx,video/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <small className="text-muted">
            Allowed: PDF, PPT, DOC, Videos
          </small>
        </div>

        {/* UPLOAD BUTTON */}
        <button
          className="btn btn-success w-100 mt-4 py-2"
          disabled={uploading}
          onClick={uploadFile}
        >
          {uploading ? "Uploading…" : "Upload Material"}
        </button>
      </div>
    </div>
  );
}
