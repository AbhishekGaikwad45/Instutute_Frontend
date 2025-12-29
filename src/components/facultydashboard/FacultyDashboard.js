import React, { useState } from "react";

import FacultyHeader from "../Header/FacultyHeader";
import FacultySidebar from "../Sidebar/FacultySidebar";

import FacultyHome from "./FacultyHome";
import FacultyAttendance from "./FacultyAttendance";
import FacultyHistory from "./FacultyHistory";
import ShowFacultyDetails from "./ShowFacultyDetails";
import UploadPage from "./UploadPage";
import ViewUploadedFiles from "./ViewUploadedFiles";
import UploadMarks from "./UploadMarks";
import CreateTest from "./CreateTest";
import StudentProjectAdd from "./StudentProjectAdd";
import StudentProjectList from "./StudentProjectList";

export default function FacultyDashboard() {

  const stored = localStorage.getItem("user");
  const user = stored ? JSON.parse(stored) : null;

  // 🔥 MAIN FIX
  const faculty =
  user?.role === "faculty"
    ? {
        id: user.data?.id || null,
        name: user.data?.name || "Faculty",
        email: user.data?.email || "",
        role: "faculty"
      }
    : null;


  const [page, setPage] = useState("home");

  console.log("FACULTY:", faculty);

  if (!user || user.role !== "faculty") {
  return <h2 style={{ padding: 40, color: "red" }}>Unauthorized Access</h2>;
}


  const renderPage = () => {
    switch (page) {
      case "home":
        return <FacultyHome faculty={faculty} setPage={setPage} />;

      case "attendance":
        return <FacultyAttendance faculty={faculty} />;

      case "history":
        return <FacultyHistory faculty={faculty} />;

      case "facultyDetail":
        return <ShowFacultyDetails />;

      case "upload":
        return <UploadPage />;

      case "viewFiles":
        return <ViewUploadedFiles />;

      case "uploadMarks":
        return <UploadMarks />;

      case "createTest":
        return <CreateTest />;

      case "addproject":
        return <StudentProjectAdd />;

      case "Listproject":
        return <StudentProjectList />;

      default:
        return <FacultyHome faculty={faculty} setPage={setPage} />;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <>
      <FacultyHeader faculty={faculty} onLogout={handleLogout} />

      <div className="container-fluid">
        <div className="row">
          <div
            className="col-2 bg-dark text-white vh-100 position-fixed"
            style={{ top: "60px", padding: 0 }}
          >
            <FacultySidebar activePage={page} setPage={setPage} />
          </div>

          <div className="col-10 offset-2 mt-5 pt-3">
            {renderPage()}
          </div>
        </div>
      </div>
    </>
  );
}
