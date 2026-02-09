import React, { useEffect, useState } from "react";
import api from "../Api/axiosInstance";
import { toast } from "react-toastify";

export default function LeaveApproval() {

  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
  const res = await api.get("/api/leave/pending");
  console.log(res.data);   // 👈 ADD THIS
  setLeaves(res.data);
};


  const action = async (id, status) => {
    await api.post(`/api/leave/update/${id}`, {
      status,
      remark: status === "REJECTED" ? "Not valid" : "Approved"
    });

    toast.success(`Leave ${status}`);
    load();
  };

  return (
    <div className="container mt-4">
      <h3>Leave Approvals</h3>

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Student ID</th>
            <th>Student Name</th>
            <th>From</th>
            <th>To</th>
            <th>Reason</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {leaves.map(l => (
            <tr key={l.id}>
              <td>{l.studentId}</td>
              <td>{l.studentName}</td>
              <td>{l.fromDate}</td>
              <td>{l.toDate}</td>
              <td>{l.reason}</td>
              <td>
                <button className="btn btn-success btn-sm"
                  onClick={()=>action(l.id,"APPROVED")}>
                  Approve
                </button>
                <button className="btn btn-danger btn-sm ms-2"
                  onClick={()=>action(l.id,"REJECTED")}>
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
