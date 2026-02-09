import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../Api/axiosInstance";

export default function EnquiryFormPage() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    collegeName: "",
    education: "",
    passOutYear: "",
    city: "",
    nativePlace: "",
    address: "",
    message: "",
  });

  // ================= HELPERS =================
  const validateEmail = (email) => /^\S+@\S+\.\S+$/.test(email);
  const validateMobile = (mobile) => /^[0-9]{10}$/.test(mobile);

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= SUBMIT =================
  const submitEnquiry = async () => {

    const {
      name, email, mobile, collegeName,
      education, passOutYear, city,
      nativePlace, address, message
    } = form;

    if (
      !name || !email || !mobile || !collegeName ||
      !education || !passOutYear || !city ||
      !nativePlace || !address || !message
    ) {
      toast.error("All fields are required!");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Invalid email format!");
      return;
    }

    if (!validateMobile(mobile)) {
      toast.error("Mobile must be 10 digits!");
      return;
    }

    try {
      // ===== DUPLICATE EMAIL =====
      const emailRes = await api.get("/api/enquiry/check-email", {
        params: { email },
      });

      if (emailRes.data === true) {
        toast.error("Email already exists!");
        return;
      }

      // ===== DUPLICATE MOBILE =====
      const mobileRes = await api.get("/api/enquiry/check-mobile", {
        params: { mobile },
      });

      if (mobileRes.data === true) {
        toast.error("Mobile already exists!");
        return;
      }

      // ===== ADD ENQUIRY =====
      await api.post("/api/enquiry/add", form);

      toast.success("Enquiry submitted successfully 🎉");

      setForm({
        name: "",
        email: "",
        mobile: "",
        collegeName: "",
        education: "",
        passOutYear: "",
        city: "",
        nativePlace: "",
        address: "",
        message: "",
      });

    } catch (err) {
      toast.error("Failed to submit enquiry!");
    }
  };

  // ================= UI =================
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="card shadow-lg border-0 rounded-4">

            {/* HEADER */}
            <div
              className="card-header text-white text-center py-4 rounded-top-4"
              style={{ background: "linear-gradient(135deg,#02284F,#0d6efd)" }}
            >
              <h3 className="mb-1">Enquiry Form</h3>
              <small>We will contact you shortly</small>
            </div>

            {/* BODY */}
            <div className="card-body p-4">
              <div className="row g-3">

                <div className="col-md-6">
                  <input
                    className="form-control"
                    placeholder="Full Name"
                    name="name"
                    value={form.name}
                    onChange={handle}
                  />
                </div>

                <div className="col-md-6">
                  <input
                    className="form-control"
                    placeholder="Email Address"
                    name="email"
                    value={form.email}
                    onChange={handle}
                  />
                </div>

                <div className="col-md-6">
                  <input
                    className="form-control"
                    placeholder="Mobile Number"
                    maxLength={10}
                    value={form.mobile}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        mobile: e.target.value.replace(/\D/g, "")
                      })
                    }
                  />
                </div>

                <div className="col-md-6">
                  <input
                    className="form-control"
                    placeholder="College Name"
                    name="collegeName"
                    value={form.collegeName}
                    onChange={handle}
                  />
                </div>

                <div className="col-md-6">
                  <input
                    className="form-control"
                    placeholder="Education"
                    name="education"
                    value={form.education}
                    onChange={handle}
                  />
                </div>

                <div className="col-md-6">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Pass Out Year"
                    name="passOutYear"
                    value={form.passOutYear}
                    onChange={handle}
                  />
                </div>

                <div className="col-md-6">
                  <input
                    className="form-control"
                    placeholder="City"
                    name="city"
                    value={form.city}
                    onChange={handle}
                  />
                </div>

                <div className="col-md-6">
                  <input
                    className="form-control"
                    placeholder="Native Place"
                    name="nativePlace"
                    value={form.nativePlace}
                    onChange={handle}
                  />
                </div>

                <div className="col-md-12">
                  <textarea
                    className="form-control"
                    rows="2"
                    placeholder="Address"
                    name="address"
                    value={form.address}
                    onChange={handle}
                  />
                </div>

                <div className="col-md-12">
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Message"
                    name="message"
                    value={form.message}
                    onChange={handle}
                  />
                </div>

              </div>

              <button
                className="btn btn-primary w-100 mt-4 fw-bold"
                onClick={submitEnquiry}
              >
                Submit Enquiry
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
