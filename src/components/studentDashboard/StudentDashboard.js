import React, { useState } from "react";
import StudentHeader from "../Header/StudentHeader";
import StudentSidebar from "../Sidebar/StudentSidebar";

import DashboardPage from "./DashboardPage";
import MyBatchesPage from "./MyBatchesPage";
import MyAttendance from "./MyAttendance";
import StudyMaterialsPage from "./StudyMaterialsPage";
import ProfilePage from "./ProfilePage";
import StudentPerformance from "./StudentPerformance";
import ApplyLeave from "./ApplyLeave";

export default function StudentDashboard() {
  const student = JSON.parse(localStorage.getItem("student"));
  const [activePage, setActivePage] = useState("dashboard");




  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  if (!student) {
    return <h2 className="p-5 text-danger">Unauthorized Access</h2>;
  }

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardPage student={student} />;
      case "batches":
        return <MyBatchesPage studentId={student.studentId} />;
      case "attendance":
        return <MyAttendance studentId={student.studentId} />;
      case "materials":
        return <StudyMaterialsPage />;


      case "performance":
        return <StudentPerformance studentId={student.studentId} />;

       case "leave":
        return <ApplyLeave student={student} />;

      case "profile":
        return <ProfilePage student={student} />;

      default:
        return <DashboardPage student={student} />;
    }
  };

  return (
    <div className="d-flex">
      {/* HEADER */}
      <div className="w-100 position-fixed top-0 start-0" style={{ zIndex: 1000 }}>
        <StudentHeader student={student} logout={logout} />
      </div>

      {/* SIDEBAR */}
      <div
        className="bg-dark text-white position-fixed top-0 start-0 vh-100 pt-5"
        style={{ width: "240px", marginTop: "60px" }}
      >
        <StudentSidebar activePage={activePage} setActivePage={setActivePage} />
      </div>

      {/* MAIN CONTENT */}
      <div
        className="flex-grow-1 overflow-auto"
        style={{
          marginLeft: "240px",
          marginTop: "60px",
          height: "calc(100vh - 60px)",
        }}
      >
        <div className="p-4">{renderPage()}</div>
      </div>
    </div>
  );
}
