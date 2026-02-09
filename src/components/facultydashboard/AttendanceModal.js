import React from "react";
import { toast } from "react-toastify";

export default function AttendanceModal({ list, attendance, close, toggle }) {
  
  const handleToggle = (id) => {
    toggle(id);

    const status = attendance[id] === "PRESENT" ? "ABSENT" : "PRESENT";

    if (status === "PRESENT") {
      toast.success(`${id} Marked PRESENT`);
    } else {
      toast.error(`${id} Marked ABSENT`);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 20,
          width: 650,
          maxHeight: "80vh",
          overflowY: "auto",
          borderRadius: 10,
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        }}
      >
        <h3 className="mb-3 text-center fw-bold">📊 Attendance Summary</h3>

        {list.map((s) => (
          <div
            key={s.studentId}
            className="d-flex justify-content-between align-items-center p-2"
            style={{
              background: "#f8f8f8",
              borderRadius: 6,
              marginBottom: 10,
              border: "1px solid #ddd",
            }}
          >
            <span className="fw-semibold">
              {s.studentId} — {s.name}
            </span>

            <button
              onClick={() => handleToggle(s.studentId)}
              className={`btn ${
                attendance[s.studentId] === "PRESENT"
                  ? "btn-success"
                  : "btn-danger"
              }`}
            >
              {attendance[s.studentId]}
            </button>
          </div>
        ))}

        <button
          className="btn btn-secondary mt-3 w-100"
          onClick={() => {
            toast.info("Attendance Window Closed");
            close();
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
