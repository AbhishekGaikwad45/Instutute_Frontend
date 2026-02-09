import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../Api/axiosInstance"; // ✅ axios instance

export default function StudentFeeStatusPage() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [pendingForStudent, setPendingForStudent] = useState(0);
  const [amount, setAmount] = useState("");

  // ================= LOAD DATA =================
  const load = async () => {
  try {
    const res = await api.get("/api/student/all-with-fees");
    console.log("Fee API response:", res.data); // 👈 ADD THIS
    setData(res.data);
    setFiltered(res.data);
  } catch {
    toast.error("Failed to load fee data!");
  }
};


  useEffect(() => {
    load();
  }, []);

  // ================= SEARCH FILTER =================
  useEffect(() => {
    const term = search.toLowerCase();

    const f = data.filter((d) => {
      const s = d.student;
      return (
        s.studentId.toLowerCase().includes(term) ||
        s.name.toLowerCase().includes(term)
      );
    });

    setFiltered(f);
  }, [search, data]);

  // ================= OPEN MODAL =================
  const openPaymentModal = (studentId, pending) => {
    setSelectedStudentId(studentId);
    setPendingForStudent(pending);
    setAmount("");
    setShowModal(true);
  };

  // ================= ADD PAYMENT =================
  const addPayment = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error("Enter valid installment amount");
      return;
    }

    if (pendingForStudent <= 0) {
      toast.error("Full fees already paid!");
      return;
    }

    if (Number(amount) > pendingForStudent) {
      toast.error(
        `Amount exceeds pending! Pending: ₹${pendingForStudent}`
      );
      return;
    }

    try {
      await api.post("/api/payments/add", {
        studentId: selectedStudentId,
        amount: Number(amount),
        status: "PAID",
      });

      toast.success("Installment added successfully!");
      setShowModal(false);
      load();
    } catch {
      toast.error("Payment failed!");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-primary mb-3">Student Fee Status</h2>

      {/* SEARCH BOX */}
      <input
        type="text"
        placeholder="Search by Student ID or Name..."
        className="form-control mb-3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABLE */}
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Total Fees</th>
            <th>Total Paid</th>
            <th>Pending</th>
            <th>Add Installment</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((d, idx) => {
            const s = d.student;
            return (
              <tr key={idx}>
                <td>{s.studentId}</td>
                <td>{s.name}</td>
                <td>₹{Number(s.totalFees).toLocaleString()}</td>
                <td>₹{Number(d.totalPaid).toLocaleString()}</td>
                <td>₹{Number(d.pending).toLocaleString()}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm"
                    disabled={Number(d.pending) <= 0}
                    onClick={() =>
                      openPaymentModal(
                        s.studentId,
                        Number(d.pending)
                      )
                    }
                  >
                    + Add Installment
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* MODAL */}
      {showModal && (
        <div className="modal show fade d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Installment</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <p>
                  <strong>Student ID:</strong> {selectedStudentId}
                </p>
                <p>
                  <strong>Pending Fees:</strong> ₹{pendingForStudent}
                </p>

                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="modal-footer d-flex flex-column gap-2">
                <button
                  className="btn btn-primary w-100"
                  onClick={addPayment}
                >
                  Save Payment
                </button>

                <button
                  className="btn btn-secondary w-100"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-center" autoClose={1500} />
    </div>
  );
}
