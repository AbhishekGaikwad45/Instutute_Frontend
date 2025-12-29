import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import api from "../Api/axiosInstance"; // ✅ axios instance

// ---------------------------------------------
// 🔵 DAY CALCULATE FUNCTION
// ---------------------------------------------
const getDayName = (dateStr) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[new Date(dateStr).getDay()];
};

export default function NoticeList() {
  const [notices, setNotices] = useState([]);

  const [editingNotice, setEditingNotice] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [editDate, setEditDate] = useState("");

  useEffect(() => {
    loadNotices();
  }, []);

  // ---------------------------------------------
  // 🔵 LOAD ALL NOTICES
  // ---------------------------------------------
  const loadNotices = async () => {
    try {
      const res = await api.get("/api/notice/all");

      // Latest on top
      const sorted = [...res.data].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setNotices(sorted);
    } catch (err) {
      toast.error("Failed to load notices");
    }
  };

  // ---------------------------------------------
  // 🔴 DELETE NOTICE
  // ---------------------------------------------
  const deleteNotice = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;

    try {
      await api.delete(`/api/notice/delete/${id}`);
      toast.success("Notice Deleted!");
      setNotices(notices.filter((n) => n.id !== id));
    } catch {
      toast.error("Failed to delete notice");
    }
  };

  // ---------------------------------------------
  // ✏ OPEN EDIT MODAL
  // ---------------------------------------------
  const openEdit = (notice) => {
    setEditingNotice(notice);
    setEditTitle(notice.title || "");
    setEditMessage(notice.message);
    setEditDate(notice.date);
  };

  // ---------------------------------------------
  // 🔵 UPDATE NOTICE
  // ---------------------------------------------
  const updateNotice = async () => {
    if (!editMessage.trim()) {
      toast.error("Message required!");
      return;
    }

    const updatedBody = {
      ...editingNotice,
      title: editTitle,
      message: editMessage,
      date: editDate,
      dayOfWeek: getDayName(editDate),
    };

    try {
      await api.put(
        `/api/notice/update/${editingNotice.id}`,
        updatedBody
      );

      toast.success("Notice updated!");
      setEditingNotice(null);
      loadNotices();
    } catch (err) {
      toast.error("Failed to update notice");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-primary mb-3">All Notices</h2>

      {notices.length === 0 && (
        <p className="text-center text-muted">No notices available</p>
      )}

      {notices.map((n) => (
        <div className="card shadow-sm p-3 mb-3" key={n.id}>
          <h4 className="fw-bold">{n.title || "Untitled Notice"}</h4>

          <p>{n.message}</p>

          <p className="text-muted m-0">
            <strong>Date:</strong> {n.date}
          </p>

          <p className="text-muted m-0">
            <strong>Day:</strong> {n.dayOfWeek}
          </p>

          <p className="mt-2 text-secondary" style={{ fontSize: "14px" }}>
            Posted by: <strong>{n.createdByName}</strong>{" "}
            ({n.createdByRole})
          </p>

          <div className="mt-2">
            <button
              className="btn btn-sm btn-warning me-2"
              onClick={() => openEdit(n)}
            >
              Edit
            </button>

            <button
              className="btn btn-sm btn-danger"
              onClick={() => deleteNotice(n.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* ----------------------------------------------
          🟦 EDIT MODAL
      ---------------------------------------------- */}
      {editingNotice && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <h4>Edit Notice</h4>

              <label className="form-label mt-2">Title</label>
              <input
                type="text"
                className="form-control"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />

              <label className="form-label mt-2">Message</label>
              <textarea
                className="form-control"
                rows={3}
                value={editMessage}
                onChange={(e) => setEditMessage(e.target.value)}
              ></textarea>

              <label className="form-label mt-2">Date</label>
              <input
                type="date"
                className="form-control"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
              />

              <p className="mt-2 text-muted">
                🗓 <strong>Day:</strong>{" "}
                {editDate ? getDayName(editDate) : "-"}
              </p>

              <div className="mt-3 text-end">
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => setEditingNotice(null)}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-primary"
                  onClick={updateNotice}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={1500} />
    </div>
  );
}
