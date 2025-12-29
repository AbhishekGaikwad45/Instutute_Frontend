export default function Sidebar({ setPage, activePage }) {
  const menuItems = [
    { key: "dashbord", label: "Dashbord" },
    { key: "addStudent", label: "Add Student" },
    { key: "AddFaculty", label: "Add Faculty" },
    { key: "AddBatch", label: "Create Batch" },
    { key: "assignFaculty", label: "Assign Faculty for Batch" },
    { key: "assignStudent", label: "Assign Student for Batch" },
    { key: "AttendamceReport", label: "Attendance" },
    { key: "reports", label: "Student Report" },
    { key: "Students", label: "All Students" },
    { key: "ShowFacultyDetails", label: "Show Faculty Details" },
    { key: "payment", label: "Payment Deatils" },
    { key: "addCourse", label: "Add Course" },
    { key: "enquiryForm", label: "Enquiry Form" },
    { key: "enquiryList", label: "Enquiry List" },
    { key: "notice", label: "Create Notice" },
    { key: "noticelist", label: "Notice List" },
    { key: "placementUpload", label: "Placement Upload" },
    { key: "placementList", label: "Placement List" },
    { key: "batchstudent", label: "Batchwise Students" },
    { key: "leaveapproval", label: "Leave Approval" },
    { key: "tasks", label: "Tasks" },

  ];

  return (
    <div
      style={{

        width: "240px",
        height: "calc(100vh - 60px)", 
        background: "#0a2dc7ff",
        color: "white",
        position: "fixed",
        top: "60px",
        left: 0,
        overflowY: "auto",        
        padding: "20px",
        zIndex: 1500,
      }}
    >
      <h4 style={{ marginBottom: "20px" }}>Menu</h4>

      {menuItems.map((item) => (
        <p
          key={item.key}
          onClick={() => setPage(item.key)}
          style={{
            cursor: "pointer",
            padding: "12px",
            borderRadius: "6px",
            background: activePage === item.key ? "#334155" : "transparent",
            fontWeight: activePage === item.key ? "bold" : "normal",
            transition: "0.2s",
            marginBottom: "10px",
          }}
        >
          {item.label}
        </p>
      ))}
    </div>
  );
}
