import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../Api/axiosInstance"; // ✅ axios instance

export default function FacultyAttendanceHistory() {
  const [data, setData] = useState([]);
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);

  const [batchSearch, setBatchSearch] = useState("");

  const [searchStudent, setSearchStudent] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [filteredRecords, setFilteredRecords] = useState([]);

  // ================= LOAD ALL BATCH DATA =================
  useEffect(() => {
    loadBatchData();
  }, []);

  async function loadBatchData() {
    try {
      const res = await api.get("/api/batch/full-data");
      setData(res.data);
      setFilteredBatches(res.data);
    } catch {
      toast.error("Failed to load data!");
    }
  }

  // 🔍 FILTER BATCH BY (batchCode / batchName / facultyName)
  function filterBatchList(value) {
    setBatchSearch(value);

    const val = value.toLowerCase();

    const list = data.filter((item) => {
      const b = item.batch;
      const f = item.faculty;

      return (
        b.batchCode.toLowerCase().includes(val) ||
        b.batchName.toLowerCase().includes(val) ||
        f?.name?.toLowerCase().includes(val)
      );
    });

    setFilteredBatches(list);
  }

  // WHEN SELECT BATCH
  function selectBatch(batchObj) {
    setSelectedBatch(batchObj);
    setFilteredRecords(batchObj.attendance || []);
  }

  // ================= APPLY FILTERS =================
  function applyFilters(
    studentValue = searchStudent,
    start = startDate,
    end = endDate
  ) {
    if (!selectedBatch) return;

    let list = [...selectedBatch.attendance];

    // STUDENT SEARCH
    if (studentValue.trim() !== "") {
      const val = studentValue.toLowerCase();

      list = list.filter((rec) => {
        const stu = selectedBatch.students.find(
          (s) => s.studentId === rec.studentId
        );
        return (
          rec.studentId.toLowerCase().includes(val) ||
          stu?.name?.toLowerCase().includes(val)
        );
      });
    }

    // DATE RANGE
    if (start !== "" && end !== "") {
      list = list.filter(
        (rec) => rec.date >= start && rec.date <= end
      );
    }

    setFilteredRecords(list);
  }

  function resetFilters() {
    setSearchStudent("");
    setStartDate("");
    setEndDate("");

    if (selectedBatch)
      setFilteredRecords(selectedBatch.attendance);
  }

  // SORT DATE
  const sortedRecords = [...filteredRecords].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  return (
    <div className="container mt-4">
      <div className="row">
        {/* LEFT SIDE — ALL BATCHES + SEARCH */}
        <div className="col-md-3">
          <h5>All Batches</h5>

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search by Batch or Faculty..."
            value={batchSearch}
            onChange={(e) => filterBatchList(e.target.value)}
          />

          {filteredBatches.map((item, index) => (
            <div
              key={index}
              className="card p-2 mb-2"
              style={{ cursor: "pointer" }}
              onClick={() => selectBatch(item)}
            >
              <b>{item.batch.batchCode}</b>
              <p>{item.batch.batchName}</p>
              <small className="text-primary">
                Faculty: {item.faculty?.name || "Not Assigned"}
              </small>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE — DETAILS */}
        <div className="col-md-9">
          {!selectedBatch && <h4>Select a batch to view details…</h4>}

          {selectedBatch && (
            <>
              <h3>
                {selectedBatch.batch.batchCode} — Attendance History
              </h3>
              <h6>
                Faculty: {selectedBatch.faculty?.name || "-"}
              </h6>

              {/* FILTER SECTION */}
              <div className="card p-3 mt-3">
                <h5>Filters</h5>

                <div className="row">
                  <div className="col-md-4">
                    <label>Search Student</label>
                    <input
                      type="text"
                      className="form-control"
                      value={searchStudent}
                      onChange={(e) => {
                        setSearchStudent(e.target.value);
                        applyFilters(
                          e.target.value,
                          startDate,
                          endDate
                        );
                      }}
                      placeholder="ID or Name"
                    />
                  </div>

                  <div className="col-md-4">
                    <label>Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        applyFilters(
                          searchStudent,
                          e.target.value,
                          endDate
                        );
                      }}
                    />
                  </div>

                  <div className="col-md-4">
                    <label>End Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        applyFilters(
                          searchStudent,
                          startDate,
                          e.target.value
                        );
                      }}
                    />
                  </div>
                </div>

                <button
                  className="btn btn-secondary mt-3"
                  onClick={resetFilters}
                >
                  Reset Filters
                </button>
              </div>

              {/* ATTENDANCE TABLE */}
              <div className="card p-3 mt-3">
                <h5>Attendance Records</h5>

                <table className="table table-bordered table-striped mt-3">
                  <thead className="table-dark">
                    <tr>
                      <th>Date</th>
                      <th>Student ID</th>
                      <th>Name</th>
                      <th>Status</th>
                      <th>Topic</th>
                      <th>Faculty Code</th>
                    </tr>
                  </thead>

                  <tbody>
                    {sortedRecords.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center text-muted">
                          No records found
                        </td>
                      </tr>
                    )}

                    {sortedRecords.map((rec, index) => {
                      const stu = selectedBatch.students.find(
                        (s) => s.studentId === rec.studentId
                      );

                      const prevDate =
                        index > 0
                          ? sortedRecords[index - 1].date
                          : null;
                      const isNewDate = rec.date !== prevDate;

                      return (
                        <React.Fragment key={index}>
                          {isNewDate && index !== 0 && (
                            <tr>
                              <td
                                colSpan="6"
                                style={{
                                  background: "#e8e8e8",
                                  height: "20px",
                                }}
                              ></td>
                            </tr>
                          )}

                          <tr>
                            <td>{rec.date}</td>
                            <td>{rec.studentId}</td>
                            <td>{stu?.name || "-"}</td>
                            <td
                              className={
                                rec.status === "PRESENT"
                                  ? "text-success fw-bold"
                                  : "text-danger fw-bold"
                              }
                            >
                              {rec.status}
                            </td>
                            <td>{rec.topic || "-"}</td>
                            <td>{rec.facultyCode || "-"}</td>
                          </tr>
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
