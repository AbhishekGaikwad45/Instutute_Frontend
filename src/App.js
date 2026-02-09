import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ================= COMPONENTS ================= */

// Public
import HeaderHome from "./components/HomePage/HeaderHome";


// Counselor
import CounselorDashboard from "./components/counsellor/CounselorDashboard";
import AddStudent from "./components/counsellor/AddStudent";
import AddFaculty from "./components/counsellor/AddFaculty";
import CreateBatch from "./components/counsellor/CreateBatch";
import AssignStudent from "./components/counsellor/AssignStudentToBatch";
import AssignFaculty from "./components/counsellor/AssignFacultyToBatch";
import AddBatch from "./components/counsellor/AddBatch";
import AddCourse from "./components/counsellor/AddCourse";
import EnquiryListPage from "./components/counsellor/EnquiryListPage";
import EnquiryFormPage from "./components/counsellor/EnquiryFormPage";
import DashboardCards from "./components/counsellor/DashboardCards";
import CreateNotice from "./components/counsellor/CreateNotice";

// Faculty

import FacultyHome from "./components/facultydashboard/FacultyHome";
import FacultyAttendance from "./components/facultydashboard/FacultyAttendance";
import FacultyHistory from "./components/facultydashboard/FacultyHistory";
import UploadMarks from "./components/facultydashboard/UploadMarks";
import ViewUploadedFiles from "./components/facultydashboard/ViewUploadedFiles";
import StudentProjectAdd from "./components/facultydashboard/StudentProjectAdd";
import StudentProjectList from "./components/facultydashboard/StudentProjectList";

// Student
import StudentDashboard from "./components/studentDashboard/StudentDashboard";
import StudentAttendanceCalendar from "./components/studentDashboard/StudentAttendanceCalendar";
import StudentPerformance from "./components/studentDashboard/StudentPerformance";
import DesktopOnly from "./components/Lock/DesktopOnly";
import FacultyDashboard from "./components/facultydashboard/FacultyDashboard";
import BirthdayPopup from "./components/Birthday/BirthdayPopup";
import CounselorTasksPage from "./components/counsellor/CounselorTasksPage";

/* ================= PROTECTED ROUTE (INSIDE APP.JS) ================= */
const Protected = ({ children, role }) => {
  const student = JSON.parse(localStorage.getItem("student"));
  const user = JSON.parse(localStorage.getItem("user"));

  // ❌ Student not logged in
  if (role === "student" && !student) {
    return <Navigate to="/" replace />;
  }

  // ❌ Faculty / Counselor not logged in
  if (role !== "student" && !user) {
    return <Navigate to="/" replace />;
  }

  // ❌ Role mismatch
  if (role !== "student" && user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return (
  <>
    <BirthdayPopup />
    {children}
  </>
);

};

function App() {
  return (
    <BrowserRouter>
    <DesktopOnly>
      <Routes>

        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<HeaderHome />} />
      

        {/* ================= COUNSELOR ================= */}
        <Route path="/counselor-dashboard"
          element={
            <Protected role="counselor">
              <CounselorDashboard />
            </Protected>
          }
        />

        <Route path="/add-student"
          element={
            <Protected role="counselor">
              <AddStudent />
            </Protected>
          }
        />

        <Route path="/add-faculty"
          element={
            <Protected role="counselor">
              <AddFaculty />
            </Protected>
          }
        />

        <Route path="/create-batch"
          element={
            <Protected role="counselor">
              <CreateBatch />
            </Protected>
          }
        />

        <Route path="/assign-student"
          element={
            <Protected role="counselor">
              <AssignStudent />
            </Protected>
          }
        />

        <Route path="/assign-faculty"
          element={
            <Protected role="counselor">
              <AssignFaculty />
            </Protected>
          }
        />

        <Route path="/add-batch"
          element={
            <Protected role="counselor">
              <AddBatch />
            </Protected>
          }
        />

        <Route  path="/add-course"
          element={
            <Protected role="counselor">
              <AddCourse />
            </Protected>
          }
        />

        <Route  path="/dashboard-card"
          element={
            <Protected role="counselor">
              <DashboardCards />
            </Protected>
          }
        />

        <Route  path="/enquiry"
          element={
            <Protected role="counselor">
              <EnquiryListPage />
            </Protected>
          }
        />

        <Route path="/enquiry-form" element={<EnquiryFormPage />} />

        <Route  path="/create-notice"
          element={
            <Protected role="counselor">
              <CreateNotice />
            </Protected>
          }
        />

        <Route path="/tasks" element={<CounselorTasksPage />} />

        {/* ================= FACULTY ================= */}
        <Route path="/faculty-dashboard"
          element={
            <Protected role="faculty">
              <FacultyDashboard />
            </Protected>
          }
        >
          <Route index element={<FacultyHome />} />
          <Route path="home" element={<FacultyHome />} />
          <Route path="attendance" element={<FacultyAttendance />} />
          <Route path="history" element={<FacultyHistory />} />
          <Route path="upload-marks" element={<UploadMarks />} />
          <Route path="addproject" element={<StudentProjectAdd />} />
          <Route path="projectlist" element={<StudentProjectList />} />
          <Route path="view-uploaded-files" element={<ViewUploadedFiles />} />
        </Route>

        {/* ================= STUDENT ================= */}
        <Route
          path="/student-dashboard" element={
            <Protected role="student">
              <StudentDashboard />
            </Protected>
          }
        />

        <Route path="/student-attendance"
          element={
            <Protected role="student">
              <StudentAttendanceCalendar />
            </Protected>
          }
        />

        <Route  path="/performance"
          element={
            <Protected role="student">
              <StudentPerformance />
            </Protected>
          }
        />

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>

      <ToastContainer position="top-right" autoClose={2000} />
      </DesktopOnly>
    </BrowserRouter>
  );
}

export default App;
