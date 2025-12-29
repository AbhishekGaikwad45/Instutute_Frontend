import React, { useEffect, useState } from "react";
import api from "../Api/axiosInstance"; // ✅ axios instance

export default function FacultyHistory({ faculty }) {
  const [batches, setBatches] = useState([]);
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);

  const [batchSearch, setBatchSearch] = useState("");

  const [history, setHistory] = useState({});
  const [allRecords, setAllRecords] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (faculty?.id) {
      loadBatches();
    }
  }, [faculty]);

  // ================= LOAD BATCHES =================
  const loadBatches = async () => {
    try {
      const res = await api.get(`/api/batch/by-faculty/${faculty.id}`);
      const arr = Array.isArray(res.data) ? res.data : [];
      setBatches(arr);
      setFilteredBatches(arr);
    } catch (err) {
      console.error("Failed to load batches", err);
      setBatches([]);
      setFilteredBatches([]);
    }
  };

  // 🔍 Filter batches by search text
  const filterBatchList = (value) => {
    setBatchSearch(value);

    const val = value.toLowerCase();
    const list = batches.filter(
      (b) =>
        b.batchCode.toLowerCase().includes(val) ||
        b.batchName.toLowerCase().includes(val)
    );

    setFilteredBatches(list);
  };

  // ================= SELECT BATCH =================
  const selectBatch = (batch) => {
    setSelectedBatch(batch);
    loadHistory(batch.batchCode);
  };

  // ================= LOAD HISTORY =================
  const loadHistory = async (batchCode) => {
    try {
      const res = await api.get(
        `/api/attendance/batch/${batchCode}/all`
      );
      const arr = Array.isArray(res.data) ? res.data : [];

      setAllRecords(arr);
      groupRecords(arr);
    } catch (err) {
      console.error("Failed to load history", err);
      setHistory({});
      setAllRecords([]);
    }
  };

  // ================= GROUP BY DATE =================
  const groupRecords = (records) => {
    const grouped = {};

    records.forEach((rec) => {
      if (!grouped[rec.date]) grouped[rec.date] = [];
      grouped[rec.date].push(rec);
    });

    const sortedDates = Object.keys(grouped).sort(
      (a, b) => new Date(b) - new Date(a)
    );

    const finalObj = {};
    sortedDates.forEach((d) => (finalObj[d] = grouped[d]));

    setHistory(finalObj);
  };

  // ================= FILTER BY DATE =================
  const filterByDateRange = () => {
    if (!startDate || !endDate) {
      alert("Please select BOTH start & end date");
      return;
    }

    const filtered = allRecords.filter(
      (r) => r.date >= startDate && r.date <= endDate
    );

    groupRecords(filtered);
  };

  const resetFilter = () => {
    setStartDate("");
    setEndDate("");
    groupRecords(allRecords);
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        {/* LEFT SIDE — BATCH LIST */}
        <div className="col-3">
          <h5 className="fw-bold">Your Batches</h5>

          {/* SEARCH BAR */}
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search Batch..."
            value={batchSearch}
            onChange={(e) => filterBatchList(e.target.value)}
          />

          {/* DROPDOWN */}
          <select
            className="form-select mb-3"
            value={selectedBatch?.batchCode || ""}
            onChange={(e) => {
              const b = batches.find(
                (x) => x.batchCode === e.target.value
              );
              if (b) selectBatch(b);
            }}
          >
            <option value="">Select Batch</option>
            {filteredBatches.map((b) => (
              <option key={b.batchCode} value={b.batchCode}>
                {b.batchCode} — {b.batchName}
              </option>
            ))}
          </select>

          {/* CARD LIST */}
          {filteredBatches.map((b) => (
            <div
              key={b.batchCode}
              className="card p-2 mb-2 shadow-sm"
              style={{
                cursor: "pointer",
                border:
                  selectedBatch?.batchCode === b.batchCode
                    ? "2px solid #0d6efd"
                    : "1px solid #ddd",
              }}
              onClick={() => selectBatch(b)}
            >
              <b>{b.batchCode}</b>
              <div className="text-muted small">
                {b.batchName}
              </div>
            </div>
          ))}

          {filteredBatches.length === 0 && (
            <p className="text-muted">No batch found.</p>
          )}
        </div>

        {/* RIGHT SIDE — HISTORY */}
        <div className="col-9">
          {!selectedBatch && (
            <h4 className="text-muted">
              Select a batch to view history
            </h4>
          )}

          {selectedBatch && (
            <>
              <h3>
                Attendance History —{" "}
                <span className="text-primary">
                  {selectedBatch.batchCode}
                </span>
              </h3>

              {/* DATE FILTER */}
              <div
                className="card p-3 mb-4 shadow-sm"
                style={{ maxWidth: "700px" }}
              >
                <h5 className="fw-bold">Filter By Date</h5>
                <div className="row mt-2">
                  <div className="col-md-5">
                    <label>Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={startDate}
                      onChange={(e) =>
                        setStartDate(e.target.value)
                      }
                    />
                  </div>

                  <div className="col-md-5">
                    <label>End Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={endDate}
                      onChange={(e) =>
                        setEndDate(e.target.value)
                      }
                    />
                  </div>

                  <div className="col-md-2 d-flex align-items-end">
                    <button
                      className="btn btn-primary w-100"
                      onClick={filterByDateRange}
                    >
                      Apply
                    </button>
                  </div>

                  <div className="col-md-12 mt-2">
                    <button
                      className="btn btn-secondary w-100"
                      onClick={resetFilter}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* HISTORY */}
              {Object.keys(history).length === 0 && (
                <p className="text-muted">
                  No attendance found.
                </p>
              )}

              {Object.keys(history).map((date) => (
                <div key={date} className="mt-4">
                  <h5 className="fw-bold">{date}</h5>

                  {history[date].map((rec) => (
                    <div
                      key={rec.id}
                      className="card p-2 mt-2 shadow-sm"
                      style={{ maxWidth: "900px" }}
                    >
                      <div className="d-flex justify-content-between">
                        <div>
                          <b>{rec.studentId}</b> —{" "}
                          {rec.studentName}
                        </div>

                        <span
                          className={`badge ${
                            rec.status === "PRESENT"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {rec.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
