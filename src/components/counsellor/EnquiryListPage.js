import React, { useEffect, useState } from "react";
import api from "../Api/axiosInstance"; // ✅ axios instance

export default function EnquiryListPage() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [todayCount, setTodayCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  // Date filters
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // ================= LOAD DATA =================
  const load = async () => {
    try {
      // ALL ENQUIRIES
      const res = await api.get("/api/enquiry/all");
      const list = Array.isArray(res.data) ? res.data : [];

      setData(list);
      setFilteredData(list);
      setErrorMsg("");

      // TODAY COUNT
      const countRes = await api.get("/api/enquiry/today-count");
      setTodayCount(
        typeof countRes.data === "number" ? countRes.data : 0
      );
    } catch (err) {
      console.error(err);
      setData([]);
      setFilteredData([]);
      setTodayCount(0);
      setErrorMsg("Failed to load enquiries");
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ================= DATE HELPERS =================
  const parseDate = (d) => new Date(d + "T00:00:00");

  // ================= FILTERS =================
  const filterLastDays = (days) => {
    const now = new Date();
    const past = new Date();
    past.setDate(now.getDate() - days);

    const result = data.filter((e) => {
      if (!e.createdAt) return false;
      const date = parseDate(e.createdAt);
      return date >= past && date <= now;
    });

    setFilteredData(result);
  };

  const filterCustomRange = () => {
    if (!fromDate || !toDate) {
      alert("Please select both dates");
      return;
    }

    const start = parseDate(fromDate);
    const end = parseDate(toDate);

    const result = data.filter((e) => {
      if (!e.createdAt) return false;
      const date = parseDate(e.createdAt);
      return date >= start && date <= end;
    });

    setFilteredData(result);
  };

  // ================= UI =================
  return (
    <div className="container mt-4">
      <h2 className="text-primary mb-3">All Enquiries</h2>

      <div className="alert alert-info">
        Today’s Enquiries: <strong>{todayCount}</strong>
      </div>

      {errorMsg && (
        <div className="alert alert-danger">{errorMsg}</div>
      )}

      {/* FILTER BUTTONS */}
      <div className="mb-3 d-flex gap-2">
        <button
          className="btn btn-secondary"
          onClick={() => setFilteredData(data)}
        >
          All
        </button>

        <button
          className="btn btn-primary"
          onClick={() => filterLastDays(7)}
        >
          Last 7 Days
        </button>

        <button
          className="btn btn-primary"
          onClick={() => filterLastDays(30)}
        >
          Last 30 Days
        </button>

        <button
          className="btn btn-primary"
          onClick={() => filterLastDays(365)}
        >
          Last 1 Year
        </button>
      </div>

      {/* CUSTOM DATE FILTER */}
      <div className="d-flex mb-4 gap-2">
        <input
          type="date"
          className="form-control"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />

        <input
          type="date"
          className="form-control"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />

        <button
          className="btn btn-success"
          onClick={filterCustomRange}
        >
          Filter
        </button>
      </div>

      {/* TABLE */}
      <table className="table table-bordered table-hover shadow">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Place</th>
            <th>Education</th>
            <th>Message</th>
            <th>Created On</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center text-danger">
                No enquiries found
              </td>
            </tr>
          ) : (
            filteredData.map((e) => (
              <tr key={e.id}>
                <td>{e.id}</td>
                <td>{e.name || "—"}</td>
                <td>{e.email || "—"}</td>
                <td>{e.mobile || "—"}</td>
                <td>{e.place || "—"}</td>
                <td>{e.education || "—"}</td>

                {/* SAFE MESSAGE RENDER */}
                <td>
                  {typeof e.message === "string"
                    ? e.message
                    : "—"}
                </td>

                <td>{e.createdAt || "—"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
