import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../Api/axiosInstance"; // ✅ axios instance

export default function CreateNotice() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [date, setDate] = useState("");

  // Auto-filled values
  const createdByName = "Admin";
  const createdByRole = "ADMIN";

  const saveNotice = async () => {
    if (!message.trim()) {
      toast.error("Message required आहे!");
      return;
    }

    const body = {
      title: title.trim() || null,
      message,
      createdByName,
      createdByRole,
      date: date || null,
    };

    try {
      await api.post("/api/notice/add", body);

      toast.success("Notice created successfully!");
      setTitle("");
      setMessage("");
      setDate("");
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Failed to create notice"
      );
    }
  };

  return (
    <div className="container mt-4">
      <div className="card p-3 shadow-sm">
        <h3 className="mb-3 text-primary">Create Notice</h3>

        <div className="mb-3">
          <label className="form-label">Title (Optional)</label>
          <input
            type="text"
            className="form-control"
            placeholder="Exam Notice / Holiday Notice"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Message</label>
          <textarea
            className="form-control"
            rows={3}
            placeholder="Enter notice message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <button className="btn btn-primary" onClick={saveNotice}>
          Save Notice
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={1500} />
    </div>
  );
}
