import React from "react";

export default function FacultySidebar({ activePage, setPage }) {
  return (
    <div className="p-3">

      <div className="list-group">

        {/* Dashboard */}
        <button
          className={
            "list-group-item list-group-item-action bg-transparent text-white border-0 " +
            (activePage === "home" ? "active bg-primary text-white fw-bold" : "")
          }
          onClick={() => setPage("home")}
        >
          Dashboard
        </button>

        {/* Mark Attendance */}
        <button
          className={
            "list-group-item list-group-item-action bg-transparent text-white border-0 " +
            (activePage === "attendance" ? "active bg-primary text-white fw-bold" : "")
          }
          onClick={() => setPage("attendance")}
        >
          Mark Attendance
        </button>

        {/* Attendance History */}
        <button
          className={
            "list-group-item list-group-item-action bg-transparent text-white border-0 " +
            (activePage === "history" ? "active bg-primary text-white fw-bold" : "")
          }
          onClick={() => setPage("history")}
        >
          Attendance History
        </button>

        {/* Upload Documents (NEW) */}
        <button
          className={
            "list-group-item list-group-item-action bg-transparent text-white border-0 " +
            (activePage === "upload" ? "active bg-primary text-white fw-bold" : "")
          }
          onClick={() => setPage("upload")}
        >
          Upload Documents
        </button>
        <button
          className={
            "list-group-item list-group-item-action bg-transparent text-white border-0 " +
            (activePage === "viewFiles" ? "active bg-primary text-white fw-bold" : "")
          }
          onClick={() => setPage("viewFiles")}
        >
          View Uploaded Files
        </button>
        <button
          className={
            "list-group-item list-group-item-action bg-transparent text-white border-0 " +
            (activePage === "uploadMarks" ? "active bg-primary text-white fw-bold" : "")
          }
          onClick={() => setPage("uploadMarks")}
        >
          Upload Marks
        </button>
        <button
          className={
            "list-group-item list-group-item-action bg-transparent text-white border-0 " +
            (activePage === "createTest" ? "active bg-primary text-white fw-bold" : "")
          }
          onClick={() => setPage("createTest")}
        >
          Create Test
        </button>
        <button
          className={
            "list-group-item list-group-item-action bg-transparent text-white border-0 " +
            (activePage === "addproject" ? "active bg-primary text-white fw-bold" : "")
          }
          onClick={() => setPage("addproject")}
        >
          Add Project
        </button>
        <button
          className={
            "list-group-item list-group-item-action bg-transparent text-white border-0 " +
            (activePage === "Listproject" ? "active bg-primary text-white fw-bold" : "")
          }
          onClick={() => setPage("Listproject")}
        >
          List Project info
        </button>
        


      </div>
    </div>
  );
}
