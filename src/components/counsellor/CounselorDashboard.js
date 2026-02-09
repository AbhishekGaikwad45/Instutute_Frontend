import React, { useState } from "react";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";

import AddStudent from "../counsellor/AddStudent";
import AssignStudent from "../counsellor/AssignStudentToBatch";
import AssignFaculty from "../counsellor/AssignFacultyToBatch";
import AddFaculty from "./AddFaculty";
import CreateBatch from "./CreateBatch";
import StudentList from "./StudentList";
import FacultyAttendanceHistory from "../facultydashboard/FacultyAttendanceHistory";
import ShowFacultyDetails from "../facultydashboard/ShowFacultyDetails";
import AddCourse from "../counsellor/AddCourse";
import DashboardCards from "./DashboardCards";
import StudentPaymentPage from "./StudentPaymentPage";
import EnquiryFormPage from "./EnquiryFormPage";
import EnquiryListPage from "./EnquiryListPage";
import StudentReportPage from "./StudentReportPage";
import CreateNotice from "./CreateNotice";
import NoticeListPage from "./NoticeListPage";
import PlacementUpload from "./PlacementUpload";
import PlacementPage from "./PlacementPage";
import BatchStudents from "./BatchStudents";
import LeaveApproval from "./LeaveApproval";
import CounselorTasksPage from "./CounselorTasksPage";

export default function CounselorDashboard() {
  const [page, setPage] = useState("dashbord");

  const renderPage = () => {
    switch (page) {
      case "dashbord":
        return <DashboardCards />;
      case "addStudent":
        return <AddStudent />;
      case "AddFaculty":
        return <AddFaculty />;
      case "assignStudent":
        return <AssignStudent />;
      case "AddBatch":
        return <CreateBatch />;
      case "assignFaculty":
        return <AssignFaculty />;
      case "Students":
        return <StudentList />;
        case "AttendamceReport":
        return <FacultyAttendanceHistory />;
        case "reports":
        return <StudentReportPage />;
         case "ShowFacultyDetails":
        return <ShowFacultyDetails />;
          case "payment":
        return <StudentPaymentPage />;
         case "addCourse":
        return <AddCourse />;
        case "enquiryForm":
        return <EnquiryFormPage />;
        case "enquiryList":
        return <EnquiryListPage />;
        case "notice":
        return <CreateNotice />;
        case "noticelist":
        return <NoticeListPage />;
        case "placementUpload":
        return <PlacementUpload />;
        case "placementList":
        return <PlacementPage />;
        case "batchstudent":
        return <BatchStudents />;
         case "leaveapproval":
        return <LeaveApproval />;
        case "tasks":
        return <CounselorTasksPage />;

      default:

        return <AddStudent />;
    }
  };

  return (
    <>
      <Header />
      <Sidebar setPage={setPage} activePage={page} />


      <div
        style={{
          marginTop: "60px",
          marginLeft: "240px",   
          padding: "20px",
          height: "calc(100vh - 60px)",
          overflowY: "auto",
          background: "#f8fafc",
        }}
      >
        {renderPage()}
      </div>
    </>
  );
}
