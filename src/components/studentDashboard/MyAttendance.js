import React, { useEffect, useState } from "react";

export default function MyAttendance({ studentId }) {
  const [attendance, setAttendance] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // ---------------- FETCH ATTENDANCE ----------------
  const loadAttendance = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/attendance/student/${studentId}`
      );
      const data = await res.json();
      setAttendance(data);
    } catch (err) {
      console.error("Attendance Load Error:", err);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  // ---------------- CONVERT DATE FORMAT FIX ----------------
  const attendanceMap = {};
  attendance.forEach((a) => {
    const dateKey = a.date; 
    attendanceMap[dateKey] = a.status;
  });

  // ---------------- GENERATE MONTH CALENDAR ----------------
  const generateCalendar = (year, month) => {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);

    const days = [];

    // Add empty days before 1st
    for (let i = 0; i < first.getDay(); i++) days.push(null);

    // Add actual month days
    for (let d = 1; d <= last.getDate(); d++) {
      days.push(new Date(year, month, d));
    }

    return days;
  };

  const days = generateCalendar(year, month);

  // Format date into YYYY-MM-DD
  const formatDate = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  return (
    <div style={{ padding: 20 }}>
      <h2> My Attendance</h2>

      {/* MONTH + YEAR SELECTOR */}
      <div style={{ display: "flex", gap: 20, marginTop: 20, marginBottom: 20 }}>
        {/* MONTH SELECT */}
        <select
          className="form-control"
          style={{ width: 200 }}
          value={month}
          onChange={(e) => setMonth(parseInt(e.target.value))}
        >
          {months.map((m, i) => (
            <option value={i} key={i}>
              {m}
            </option>
          ))}
        </select>

        {/* YEAR SELECT */}
        <select
          className="form-control"
          style={{ width: 150 }}
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <option key={i} value={2023 + i}>
              {2023 + i}
            </option>
          ))}
        </select>
      </div>

      {/* WEEK HEADER */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          textAlign: "center",
          fontWeight: "bold",
          marginBottom: 10,
        }}
      >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* CALENDAR GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 8,
        }}
      >
        {days.map((day, index) => {
          if (!day)
            return (
              <div
                key={index}
                style={{
                  height: 70,
                  background: "#f1f1f1",
                  borderRadius: 6,
                }}
              />
            );

          const dateStr = formatDate(day); 
          const status = attendanceMap[dateStr];

          return (
            <div
              key={index}
              style={{
                height: 80,
                borderRadius: 8,
                border: "1px solid #ccc",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bold",
                background:
                  status === "PRESENT"
                    ? "#b2f7b2" 
                    : status === "ABSENT"
                    ? "#ffb2b2" 
                    : "white", 
              }}
            >
              {day.getDate()}
              <small>
                {status === "PRESENT"
                  ? "Present"
                  : status === "ABSENT"
                  ? "Absent"
                  : ""}
              </small>
            </div>
          );
        })}
      </div>
    </div>
  );
}
