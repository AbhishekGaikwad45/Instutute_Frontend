import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import api from "../Api/axiosInstance"; // ✅ axios instance

function getMonthDays(year, month) {
  const first = new Date(year, month - 1, 1);
  const days = [];
  while (first.getMonth() === month - 1) {
    days.push(new Date(first));
    first.setDate(first.getDate() + 1);
  }
  return days;
}

export default function StudentAttendanceCalendar() {
  const student = JSON.parse(localStorage.getItem("student"));
  const studentId = student?.studentId;

  const [records, setRecords] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    if (studentId) loadStudentHistory();
  }, [year, month, studentId]);

  // ================= LOAD ATTENDANCE =================
  const loadStudentHistory = async () => {
    try {
      const res = await api.get(
        `/api/attendance/student/${studentId}`
      );
      setRecords(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      toast.error("Failed to load attendance!");
      console.error(error);
    }
  };

  // ================= MAP DATA =================
  const monthStr = (m) => (m < 10 ? `0${m}` : `${m}`);
  const recMap = {};

  records.forEach((r) => {
    if (!r.date) return;
    if (r.date.startsWith(`${year}-${monthStr(month)}`)) {
      recMap[r.date] = r.status;
    }
  });

  const days = getMonthDays(year, month);
  const totalDays = days.length;

  let presentCount = 0;
  days.forEach((d) => {
    const key = d.toISOString().slice(0, 10);
    if (recMap[key] === "PRESENT") presentCount++;
  });

  const percent =
    totalDays === 0 ? 0 : Math.round((presentCount / totalDays) * 100);

  const dayClick = (dateString, status) => {
    if (!status) toast.info(`No attendance for ${dateString}`);
    else if (status === "PRESENT") toast.success(`${dateString}: PRESENT`);
    else toast.error(`${dateString}: ABSENT`);
  };

  return (
    <div className="container mt-4">
      <div className="card shadow p-4">
        <h3 className="fw-bold mb-3 text-center">
          Attendance – {studentId}
        </h3>

        {/* YEAR & MONTH */}
        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label fw-semibold">Select Year</label>
            <select
              className="form-select"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {Array.from({ length: 5 }).map((_, i) => {
                const y = new Date().getFullYear() - 2 + i;
                return (
                  <option key={y} value={y}>
                    {y}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold">Select Month</label>
            <select
              className="form-select"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4 d-flex align-items-end">
            <span className="badge bg-primary fs-6 w-100 py-2">
              Present: {presentCount} / {totalDays} ({percent}%)
            </span>
          </div>
        </div>

        {/* CALENDAR */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "10px",
          }}
        >
          {days.map((d) => {
            const key = d.toISOString().slice(0, 10);
            const status = recMap[key];

            const bg =
              status === "PRESENT"
                ? "#d4edda"
                : status === "ABSENT"
                ? "#f8d7da"
                : "#f8f9fa";

            const border =
              status === "PRESENT"
                ? "1px solid #28a745"
                : status === "ABSENT"
                ? "1px solid #dc3545"
                : "1px solid #ced4da";

            return (
              <div
                key={key}
                className="p-3 text-center rounded shadow-sm"
                onClick={() => dayClick(key, status)}
                style={{ minHeight: "70px", background: bg, border }}
              >
                <div className="fw-bold">{d.getDate()}</div>
                <small className="text-muted">
                  {status === "PRESENT" && "✔ Present"}
                  {status === "ABSENT" && "✖ Absent"}
                </small>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
