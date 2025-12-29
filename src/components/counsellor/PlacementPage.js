import React, { useEffect, useState } from "react";
import api from "../Api/axiosInstance"; // ✅ axios instance

export default function PlacementPage() {
  const [list, setList] = useState([]);

  useEffect(() => {
    loadPlacements();
  }, []);

  const loadPlacements = async () => {
    try {
      const res = await api.get("/api/file/placement/all");

      // 🔥 DESCENDING BY ID (latest first)
      const sorted = Array.isArray(res.data)
        ? [...res.data].sort((a, b) => b.id - a.id)
        : [];

      setList(sorted);
    } catch (err) {
      console.error(err);
      setList([]);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Our Placed Students</h2>

      <div className="row">
        {list.map((p) => (
          <div className="col-md-3 mb-4" key={p.id}>
            <div className="card shadow text-center">
              <img
                src={p.url}
                alt={p.fileName}
                style={{ height: "220px", objectFit: "cover" }}
              />

              <div className="card-body">
                <h5 className="mb-0">{p.fileName}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
