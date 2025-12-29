import React from "react";
import Sidebar from "./Sidebar";

export default function MainLayout({ children }) {
  return (
    <div>
      {/* Sidebar Fixed */}
      <Sidebar />

      {/* Main Content */}
      <div style={{ marginLeft: "260px", padding: "20px", minHeight: "100vh" }}>
        {children}
      </div>
    </div>
  );
}
