import React, { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";
import api from "../Api/axiosInstance"; // ✅ axios instance

export default function DashboardPage({ student }) {
  const [batches, setBatches] = useState([]);
  const [materialsCount, setMaterialsCount] = useState(0);
  const [attendancePercent, setAttendancePercent] = useState(0);
  const [notices, setNotices] = useState([]);
  const [latestTests, setLatestTests] = useState([]);

  const chartRef = useRef(null);

  // ================= STUDENT BATCHES =================
  useEffect(() => {
    const loadBatches = async () => {
      try {
        const res = await api.get(
          `/api/student/${student.studentId}/batches`
        );
        setBatches(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setBatches([]);
      }
    };

    loadBatches();
  }, [student.studentId]);

  
 // ================= MATERIAL COUNT (STUDENT BATCH WISE) =================
useEffect(() => {
  if (batches.length === 0) {
    setMaterialsCount(0);
    return;
  }

  const loadMaterials = async () => {
    try {
      let total = 0;

      for (const b of batches) {
        const batchCode = b.batchCode || b.batch?.batchCode;
        if (!batchCode) continue;

        const res = await api.get(`/api/file/batch/${batchCode}`);

        if (Array.isArray(res.data)) {
          total += res.data.length;
        }
      }

      setMaterialsCount(total);
    } catch (err) {
      console.error(err);
      setMaterialsCount(0);
    }
  };

  loadMaterials();
}, [batches]);



  // ================= ATTENDANCE % =================
  useEffect(() => {
    const loadAttendance = async () => {
      try {
        const res = await api.get(
          `/api/attendance/percentage/${student.studentId}`
        );
        setAttendancePercent(Number(res.data) || 0);
      } catch (err) {
        console.error(err);
        setAttendancePercent(0);
      }
    };

    loadAttendance();
  }, [student.studentId]);

  // ================= LATEST NOTICES =================
  useEffect(() => {
    const loadNotices = async () => {
      try {
        const res = await api.get("/api/notice/latest");
        setNotices(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Notice Error:", err);
        setNotices([]);
      }
    };

    loadNotices();
  }, []);

  // ================= LATEST TESTS (PER BATCH) =================
  useEffect(() => {
    if (batches.length === 0) return;

    const fetchLatestTests = async () => {
      const results = [];

      for (const b of batches) {
        const batchCode = b.batchCode || b.batch?.batchCode;
        if (!batchCode) continue;

        try {
          const res = await api.get(`/api/test/latest/${batchCode}`);

          const test = res.data;
          if (test && test.id) {
            results.push({
              batchCode,
              title: test.title,
              date: test.testDate,
            });
          }
        } catch (err) {
          // ignore if no test for batch
          console.error("Test load error:", err);
        }
      }

      setLatestTests(results);
    };

    fetchLatestTests();
  }, [batches]);

  // ================= ATTENDANCE CHART =================
  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");

    if (chartRef.current._chartInstance) {
      chartRef.current._chartInstance.destroy();
    }

    const chart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Present", "Absent"],
        datasets: [
          {
            data: [attendancePercent, 100 - attendancePercent],
            backgroundColor: ["#4CAF50", "#E74C3C"],
          },
        ],
      },
      options: {
        cutout: "70%",
        plugins: { legend: { display: false } },
        maintainAspectRatio: false,
      },
    });

    chartRef.current._chartInstance = chart;
    return () => chart.destroy();
  }, [attendancePercent]);

  const getDayName = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        weekday: "long",
      });
    } catch {
      return "";
    }
  };

  return (
    <div className="container-fluid">
      <h2 className="fw-bold">👋 Welcome, {student.name}</h2>
      <h6 className="text-muted mb-3">Student ID: {student.studentId}</h6>

      {/* TOP CARDS */}
      <div className="row g-4">
        <div className="col-md-3">
          <div className="card p-3 text-center shadow-sm">
            <h6>Course</h6>
            <h5>{student.courseEnrolledFor || "No Course"}</h5>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 text-center shadow-sm">
            <h6>Total Batches</h6>
            <h2>{batches.length}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 text-center shadow-sm">
            <h6>Attendance</h6>
            <h2>{attendancePercent}%</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 text-center shadow-sm">
            <h6>Study Materials</h6>
            <h2>{materialsCount}</h2>
          </div>
        </div>
      </div>

      {/* SECOND ROW */}
      <div className="row mt-4 g-4">
        {/* NOTICES */}
        <div className="col-md-4">
          <div className="card p-3 shadow-sm text-center" style={{ height: "260px" }}>
            <h6 className="mb-2">Latest Notices</h6>

            <div style={{ maxHeight: "160px", overflowY: "auto", textAlign: "left" }}>
              {notices.length === 0 ? (
                <p className="text-muted">No Notices Available</p>
              ) : (
                notices.map((n) => (
                  <div key={n.id} className="mb-2">
                    <p className="fw-bold mb-0">{n.title || "Notice"}</p>
                    <small>{n.message}</small>
                    <br />
                    <small className="text-muted">
                      {n.date} ({getDayName(n.date)})
                    </small>
                    <hr />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* LATEST TESTS */}
        <div className="col-md-4">
          <div className="card p-3 shadow-sm text-center">
            <h6>Latest Tests (Your Batches)</h6>

            <div style={{ maxHeight: "160px", overflowY: "auto", textAlign: "left" }}>
              {latestTests.length === 0 ? (
                <p className="text-muted">No Tests Available</p>
              ) : (
                latestTests.map((t, index) => (
                  <div key={index} className="mb-2">
                    <strong>Batch: {t.batchCode}</strong>
                    <br />
                    Test: {t.title}
                    <br />
                    Date: {t.date}
                    <hr />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ATTENDANCE CHART */}
        <div className="col-md-4">
          <div className="card p-3 shadow-sm text-center" style={{ height: "230px" }}>
            <h6>Attendance Chart</h6>
            <div style={{ height: "160px" }}>
              <canvas ref={chartRef}></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
