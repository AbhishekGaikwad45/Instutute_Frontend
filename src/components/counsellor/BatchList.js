import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function BatchList({ onUpdate }) {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load batches
  const loadBatches = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/batch/all");

      if (!res.ok) throw new Error("Failed to load batches");

      const data = await res.json();
      setBatches(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load batches!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBatches();
  }, []);

  // DELETE batch
  const handleDelete = async (code) => {
    const ok = window.confirm(`Are you sure you want to delete batch ${code}?`);
    if (!ok) return;

    try {
      const res = await fetch(`http://localhost:8080/api/batch/delete/${code}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Delete Failed");
      }

      toast.success("Batch deleted successfully!");
      loadBatches();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete batch!");
    }
  };

  if (loading) return <div>Loading batches...</div>;

  if (!batches.length)
    return <div className="mt-3 text-muted">No batches found.</div>;

  return (
    <>
      <div className="mt-4">
        <h5 className="fw-bold mb-3">All Batches</h5>

        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>Batch Code</th>
                <th>Batch Name</th>
                <th>Course</th>
                <th>Timing</th>
                <th>Start Date</th>
                <th style={{ width: 170 }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {batches.map((b) => (
                <tr key={b.batchCode}>
                  <td>{b.batchCode}</td>
                  <td>{b.batchName}</td>
                  <td>{b.courseName}</td>
                  <td>{b.batchTiming}</td>
                  <td>{b.startDate}</td>

                  <td>
                    {/* UPDATE */}
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => {
                        if (typeof onUpdate === "function") {
                          onUpdate(b.batchCode);
                        } else {
                          toast.info("Update clicked for " + b.batchCode);
                        }
                      }}
                    >
                      Update
                    </button>

                    {/* DELETE */}
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(b.batchCode)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={2500} />
    </>
  );
}
