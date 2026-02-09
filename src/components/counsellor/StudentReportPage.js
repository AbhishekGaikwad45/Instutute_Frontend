import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../Api/axiosInstance"; // ✅ axios instance

export default function StudentReportPage() {
  const [studentId, setStudentId] = useState("");
  const [summary, setSummary] = useState(null);

  // ================= FETCH SUMMARY =================
  const fetchSummary = async () => {
    if (!studentId.trim()) {
      toast.error("Please enter Student ID");
      return;
    }

    try {
      const res = await api.get(`/student/${studentId}/summary`);
      setSummary(res.data);
      toast.success("Student data loaded!");
    } catch (err) {
      if (err.response?.status === 404) {
        toast.error("Student not found!");
      } else {
        toast.error("Server error!");
      }
    }
  };

  // ================= GENERATE PDF =================
  const handleGenerate = () => {
    // 🔑 PDF open in new tab (token not required generally)
    window.open(
      `http://localhost:8080/student/${studentId}/report`,
      "_blank"
    );
  };

  // (keeping your existing helper states – untouched)
  const [openDates, setOpenDates] = useState({});
  const toggleDate = (date) => {
    setOpenDates((p) => ({ ...p, [date]: !p[date] }));
  };

  // grouping logic kept (even if not used visually)
  const grouped = {};
  (summary?.attendanceDetails || []).forEach((rec) => {
    if (!grouped[rec.date]) grouped[rec.date] = [];
    grouped[rec.date].push(rec);
  });

  return (
    <div className="container mt-5">
      {/* SEARCH BOX */}
      <div className="card shadow p-4 mb-4">
        <h3 className="text-center mb-3">Student Report Generator</h3>

        <div className="d-flex gap-3">
          <input
            className="form-control"
            placeholder="Enter Student ID"
            value={studentId}
            onChange={(e) =>
              setStudentId(e.target.value.toUpperCase())
            }
          />
          <button className="btn btn-primary" onClick={fetchSummary}>
            Search
          </button>
        </div>
      </div>

      {/* SUMMARY TABLE */}
      {summary && (
        <div className="card shadow p-4">
          <h4 className="mb-3">Student Summary</h4>

          <table className="table table-bordered">
            <tbody>
              <tr><th>Name</th><td>{summary.name}</td></tr>
              <tr><th>Mobile</th><td>{summary.mobile}</td></tr>
              <tr><th>Email</th><td>{summary.email}</td></tr>
              <tr><th>Course</th><td>{summary.courseName}</td></tr>
              <tr><th>Admission Date</th><td>{summary.admissionDate}</td></tr>

              <tr>
                <th>Batches Joined</th>
                <td>
                  {summary.allBatches ? (
                    summary.allBatches.map((b) => (
                      <span
                        key={b.batchCode}
                        className="badge bg-info text-dark me-2"
                      >
                        {b.batchCode}
                      </span>
                    ))
                  ) : (
                    "N/A"
                  )}
                </td>
              </tr>

              <tr><th>Total Lectures</th><td>{summary.totalLectures}</td></tr>
              <tr><th>Present</th><td>{summary.presentLectures}</td></tr>
              <tr><th>Absent</th><td>{summary.absentLectures}</td></tr>
              <tr>
                <th>Attendance %</th>
                <td>{summary.attendancePercentage.toFixed(2)}%</td>
              </tr>

              <tr><th>Fees Paid</th><td>₹{summary.paidAmount}</td></tr>
              <tr>
                <th>Pending Fees</th>
                <td className="text-danger">₹{summary.pendingAmount}</td>
              </tr>
            </tbody>
          </table>

          {/* TEST RECORDS */}
          <h5 className="mt-4 text-center">Test Records</h5>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Test</th>
                <th>Date</th>
                <th>Marks</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {summary.testMarks?.length > 0 ? (
                summary.testMarks.map((m, index) => (
                  <tr key={index}>
                    <td>{m.test.title}</td>
                    <td>{m.test.testDate}</td>
                    <td>{m.marks}</td>
                    <td>{m.grade}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No tests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* PROJECTS */}
          <h5 className="mt-4 text-center">Project Records</h5>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Project Topic</th>
                <th>Technology</th>
                <th>Status</th>
                <th>Assigned Date</th>
                <th>Completed Date</th>
              </tr>
            </thead>
            <tbody>
              {summary.projectRecords?.length > 0 ? (
                summary.projectRecords.map((p, index) => (
                  <tr key={index}>
                    <td>{p.projectTopic}</td>
                    <td>{p.technology}</td>
                    <td
                      className={
                        p.status === "COMPLETED"
                          ? "text-success"
                          : p.status === "IN_PROGRESS"
                          ? "text-primary"
                          : "text-danger"
                      }
                    >
                      {p.status}
                    </td>
                    <td>{p.assignedDate}</td>
                    <td>
                      {p.completedDate || "Not Completed"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No Projects Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* ATTENDANCE DETAILS */}
          <h5 className="mt-4 text-center">Attendance Details</h5>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Date</th>
                <th>Batch</th>
                <th>Topic</th>
                <th>Faculty</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {summary.attendanceDetails?.length > 0 ? (
                summary.attendanceDetails.map((a, index) => (
                  <tr key={index}>
                    <td>{a.date}</td>
                    <td>{a.batchCode}</td>
                    <td>{a.topic || "-"}</td>
                    <td>
                      {a.facultyName}{" "}
                      <span className="text-muted">
                        ({a.facultyCode})
                      </span>
                    </td>
                    <td
                      className={
                        a.status === "PRESENT"
                          ? "text-success fw-bold"
                          : "text-danger fw-bold"
                      }
                    >
                      {a.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No attendance records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* BUTTON */}
          <button
            className="btn btn-success w-100"
            onClick={handleGenerate}
          >
            Generate Full PDF Report
          </button>
        </div>
      )}

      <ToastContainer position="top-center" autoClose={1500} />
    </div>
  );
}
