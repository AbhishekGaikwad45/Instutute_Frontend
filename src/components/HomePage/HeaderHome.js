import React, { useState } from "react";
import Login from "../login/Login";
import EnquiryFormPage from "../counsellor/EnquiryFormPage";

import PlacementPage from "../counsellor/PlacementPage";

export default function HeaderHome() {
  const [activePage, setActivePage] = useState(null); 
  // null | "login" | "enquiry" | "placement"

  const closeAll = () => setActivePage(null);

  return (
    <>
      {/* ================= TOP BAR ================= */}
      <div
        className="d-flex justify-content-between align-items-center px-4 py-2 text-white fixed-top shadow"
        style={{ backgroundColor: "#02284F" }}
      >
        <img
          src="/SPARK_Logo_White_orange-2048x332.png"
          alt="Spark Logo"
          style={{ height: "45px" }}
        />

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-warning fw-bold"
            onClick={() => setActivePage("enquiry")}
          >
            Enquiry
          </button>

          <button
            className="btn btn-outline-info fw-bold"
            onClick={() => setActivePage("placement")}
          >
            Placement
          </button>

          <button
            className="btn btn-warning fw-bold"
            onClick={() => setActivePage("login")}
          >
            Login
          </button>
        </div>
      </div>

      {/* SPACE BELOW HEADER */}
      <div style={{ marginTop: "70px" }}></div>

      {/* ================= CONDITIONAL SECTION ================= */}
      {activePage ? (
        <div className="container py-2">
          <div className="d-flex justify-content-end">
            <button className="btn btn-danger mb-3" onClick={closeAll}>
              Close
            </button>
          </div>

          {activePage === "login" && <Login />}
          {activePage === "enquiry" && <EnquiryFormPage />}
          {activePage === "placement" && <PlacementPage />}
        </div>
      ) : (
        /* ================= CAROUSEL ================= */
        <div
          id="mainSlider"
          className="carousel slide carousel-fade"
          data-bs-ride="carousel"
          data-bs-interval="2000"
        >
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img
                src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg"
                className="d-block w-100"
                style={{ height: "90vh", objectFit: "cover" }}
              />
            </div>

            <div className="carousel-item">
              <img
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
                className="d-block w-100"
                style={{ height: "90vh", objectFit: "cover" }}
              />
            </div>

            <div className="carousel-item">
              <img
                src="https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg"
                className="d-block w-100"
                style={{ height: "90vh", objectFit: "cover" }}
              />
            </div>
          </div>

          <button className="carousel-control-prev" type="button" data-bs-target="#mainSlider" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" />
          </button>

          <button className="carousel-control-next" type="button" data-bs-target="#mainSlider" data-bs-slide="next">
            <span className="carousel-control-next-icon" />
          </button>
        </div>
      )}
    </>
  );
}
