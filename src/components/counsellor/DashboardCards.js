import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaUserTie,
  FaBookOpen,
  FaUserPlus,
  FaMoneyBill,
  FaUserAltSlash,
  FaUserCheck,
  FaClipboardList,
} from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import api from "../Api/axiosInstance"; // ✅ axios instance

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function DashboardCards() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    activeBatches: 0,
    newAdmissions: 0,
    todaysEnquiries: 0,
  });

  const [pendingCount, setPendingCount] = useState(0);
  const [pendingStudents, setPendingStudents] = useState([]);
  const [inactiveStudents, setInactiveStudents] = useState([]);
  const [activeStudents, setActiveStudents] = useState([]);
  const [todaysList, setTodaysList] = useState([]);

  // MODAL
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalData, setModalData] = useState([]);

  const openModal = (title, data) => {
    setModalTitle(title);
    setModalData(data);
    setShowModal(true);
  };

  useEffect(() => {
    loadStats();
    loadPendingFees();
    loadInactiveStudents();
    loadActiveStudents();
    loadTodayEnquiries();
  }, []);

  // ================= LOAD STATS =================
  const loadStats = async () => {
    try {
      const res = await api.get("/api/dashboard/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Stats Fetch Error:", err);
    }
  };

  // ================= PENDING FEES =================
  const loadPendingFees = async () => {
    try {
      const res1 = await api.get("/api/fees/pending/count");
      setPendingCount(res1.data);

      const res2 = await api.get("/api/fees/pending/students");
      setPendingStudents(res2.data);
    } catch (err) {
      console.error("Pending Fees Fetch Error:", err);
    }
  };

  // ================= INACTIVE STUDENTS =================
  const loadInactiveStudents = async () => {
    try {
      const res = await api.get("/api/student/inactive");
      setInactiveStudents(res.data);
    } catch (err) {
      console.error("Inactive Students Fetch Error:", err);
    }
  };

  // ================= ACTIVE STUDENTS =================
  const loadActiveStudents = async () => {
    try {
      const res = await api.get("/api/student/regular");
      setActiveStudents(res.data);
    } catch (err) {
      console.error("Active Students Fetch Error:", err);
    }
  };

  // ================= TODAY ENQUIRIES =================
  const loadTodayEnquiries = async () => {
    try {
      const res = await api.get("/api/enquiry/today");
      setTodaysList(res.data);
    } catch (err) {
      console.error("Today's Enquiry Fetch Error:", err);
    }
  };

  return (
    <div className="container-fluid py-4">
      <h2 className="fw-bold mb-4 text-primary">Counselor Dashboard</h2>

      <div className="row g-4">
        <Card title="Total Students" value={stats.totalStudents} icon={<FaUsers />} color="primary" />
        <Card title="Total Faculty" value={stats.totalFaculty} icon={<FaUserTie />} color="success" />
        <Card title="Active Batches" value={stats.activeBatches} icon={<FaBookOpen />} color="warning" />
        <Card title="New Admissions (This Month)" value={stats.newAdmissions} icon={<FaUserPlus />} color="info" />

        {/* TODAY ENQUIRIES */}
        <div
          className="col-md-3"
          style={{ cursor: "pointer" }}
          onClick={() => openModal("Today's Enquiries", todaysList)}
        >
          <div className="card text-white bg-danger dashboard-card">
            <div className="d-flex justify-content-between align-items-center p-3">
              <div>
                <h6 className="text-white-50">Today's Enquiries</h6>
                <h2 className="fw-bold">{stats.todaysEnquiries}</h2>
              </div>
              <FaClipboardList size={40} />
            </div>
          </div>
        </div>

        {/* PENDING FEES */}
        <div
          className="col-md-3"
          style={{ cursor: "pointer" }}
          onClick={() => openModal("Pending Fee Students", pendingStudents)}
        >
          <div className="card text-white bg-secondary dashboard-card">
            <div className="d-flex justify-content-between align-items-center p-3">
              <div>
                <h6 className="text-white-50">Pending Fees</h6>
                <h2 className="fw-bold">{pendingCount}</h2>
              </div>
              <FaMoneyBill size={40} />
            </div>
          </div>
        </div>

        {/* INACTIVE STUDENTS */}
        <div
          className="col-md-3"
          style={{ cursor: "pointer" }}
          onClick={() =>
            openModal("Inactive Students (7 Days Absent)", inactiveStudents)
          }
        >
          <div className="card text-white bg-danger dashboard-card">
            <div className="d-flex justify-content-between align-items-center p-3">
              <div>
                <h6 className="text-white-50">Inactive Students</h6>
                <h2 className="fw-bold">{inactiveStudents.length}</h2>
              </div>
              <FaUserAltSlash size={40} />
            </div>
          </div>
        </div>

        {/* ACTIVE STUDENTS */}
        <div
          className="col-md-3"
          style={{ cursor: "pointer" }}
          onClick={() =>
            openModal("Regular Students (5 Days Present)", activeStudents)
          }
        >
          <div className="card text-white bg-success dashboard-card">
            <div className="d-flex justify-content-between align-items-center p-3">
              <div>
                <h6 className="text-white-50">Active Students</h6>
                <h2 className="fw-bold">{activeStudents.length}</h2>
              </div>
              <FaUserCheck size={40} />
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {modalData.length === 0 ? (
            <p>No Records Found</p>
          ) : (
            <ul className="list-group">
              {modalData.map((s, index) => (
                <li key={index} className="list-group-item">
                  <b>{s.name}</b>
                  <br />
                  Mobile: {s.mobile}
                  {s.pendingAmount && (
                    <div>Pending: ₹{s.pendingAmount}</div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ANALYTICS */}
      <div className="mt-5">
        <h3 className="text-primary mb-4">Institute Analytics Overview</h3>

        <div className="row">
          <div className="col-md-8 mb-4">
            <div className="card shadow p-3">
              <h5 className="text-center">Summary Bar Chart</h5>

              <Bar
                data={{
                  labels: [
                    "Students",
                    "Faculty",
                    "Batches",
                    "New Admissions",
                    "Today Enquiries",
                    "Pending Fees",
                    "Inactive",
                    "Active",
                  ],
                  datasets: [
                    {
                      label: "Count",
                      data: [
                        stats.totalStudents,
                        stats.totalFaculty,
                        stats.activeBatches,
                        stats.newAdmissions,
                        stats.todaysEnquiries,
                        pendingCount,
                        inactiveStudents.length,
                        activeStudents.length,
                      ],
                      backgroundColor: [
                        "#007bff",
                        "#28a745",
                        "#ffc107",
                        "#17a2b8",
                        "#dc3545",
                        "#6c757d",
                        "#ff5733",
                        "#20c997",
                      ],
                    },
                  ],
                }}
              />
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card shadow p-3">
              <h5 className="text-center">Active vs Inactive Students</h5>

              <Pie
                data={{
                  labels: ["Active Students", "Inactive Students"],
                  datasets: [
                    {
                      data: [
                        activeStudents.length,
                        inactiveStudents.length,
                      ],
                      backgroundColor: ["#28a745", "#dc3545"],
                    },
                  ],
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, icon, color }) {
  return (
    <div className="col-md-3">
      <div className={`card text-white bg-${color} dashboard-card`}>
        <div className="d-flex justify-content-between align-items-center p-3">
          <div>
            <h6 className="text-white-50">{title}</h6>
            <h2 className="fw-bold">{value}</h2>
          </div>
          <span style={{ fontSize: "40px", opacity: 0.8 }}>{icon}</span>
        </div>
      </div>
    </div>
  );
}
