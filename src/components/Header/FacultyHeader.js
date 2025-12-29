import React from "react";

export default function FacultyHeader({ faculty, onLogout }) {
  return (
    <div
      style={{
        height: "60px",
        background: "#2976e3ff",
        borderBottom: "1px solid #ddd",
        padding: "10px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 2000,
      }}
    >
      {/* LEFT TITLE */}
      <h2 style={{ margin: 0, color: "white" }}>
        Faculty Dashboard
      </h2>

      {/* RIGHT SIDE */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <span style={{ fontSize: "16px", color: "white" }}>
          Welcome,{" "}
          <b>{faculty?.name || "Faculty"}</b>
        </span>

        <button
          onClick={onLogout}
          style={{
            padding: "6px 15px",
            background: "#e63946",
            border: "none",
            color: "white",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
