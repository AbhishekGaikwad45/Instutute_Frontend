import React from "react";
import { Card } from "react-bootstrap";

export default function ProfilePage({ student }) {
  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">

          <Card className="shadow-lg border-0 rounded-3">
            <Card.Body className="text-center p-4">

              {/* Profile Icon */}
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="Profile"
                className="img-fluid mb-3"
                style={{ width: "120px" }}
              />

              <h3 className="fw-bold mb-3">My Profile</h3>

              <div className="text-start px-3">
                <p className="fs-5">
                  <b>Name:</b> {student?.name || "N/A"}
                </p>

                <p className="fs-5">
                  <b>Email:</b> {student?.email || "N/A"}
                </p>

                <p className="fs-5">
                  <b>Mobile:</b> {student?.mobile || "N/A"}
                </p>
              </div>

              

            </Card.Body>
          </Card>

        </div>
      </div>
    </div>
  );
}
