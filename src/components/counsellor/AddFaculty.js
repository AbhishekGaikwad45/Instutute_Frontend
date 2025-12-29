import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import api from "../Api/axiosInstance"; // ✅ axios instance

export default function AddFaculty() {
  const emptyForm = {
    name: "",
    email: "",
    mobile: "",
    birthDate: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  // ================= VALIDATIONS =================
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidMobile = (mobile) =>
    /^[0-9]{10}$/.test(mobile);

  // ================= DUPLICATE CHECK =================
  const checkEmailExist = async (email) => {
    const res = await api.get("/api/faculty/check-email", {
      params: { email: email.trim() },
    });
    return res.data; // { exists: true / false }
  };

  const checkMobileExist = async (mobile) => {
    const res = await api.get("/api/faculty/check-mobile", {
      params: { mobile },
    });
    return res.data; // { exists: true / false }
  };

  // ================= HANDLE INPUT =================
  const handle = (e) => {
    let value = e.target.value;

    if (e.target.name === "mobile") {
      value = value.replace(/\D/g, "");
      if (value.length > 10) return;
    }

    setForm({ ...form, [e.target.name]: value });
  };

  // ================= SAVE FACULTY =================
  const saveFaculty = async () => {
    if (!form.name || !form.email || !form.mobile || !form.birthDate) {
      toast.error("Please fill all required fields!");
      return;
    }

    if (!isValidEmail(form.email)) {
      toast.error("Invalid Email Format!");
      return;
    }

    if (!isValidMobile(form.mobile)) {
      toast.error("Mobile number must be 10 digits!");
      return;
    }

    const emailExist = await checkEmailExist(form.email);
    if (emailExist.exists === true) {
      toast.error("Email already exists!");
      return;
    }

    const mobileExist = await checkMobileExist(form.mobile);
    if (mobileExist.exists === true) {
      toast.error("Mobile number already exists!");
      return;
    }

    setLoading(true);

    try {
      await api.post("/api/faculty/add", form);

      toast.success("Faculty added successfully!");
      setForm(emptyForm);
    } catch (error) {
      toast.error("Failed to add faculty!");
    }

    setLoading(false);
  };

  return (
    <div className="container mt-4">
      <div
        className="card shadow p-4"
        style={{ maxWidth: "600px", margin: "auto" }}
      >
        <h2 className="text-center fw-bold mb-4">Add Faculty</h2>

        {/* NAME */}
        <div className="mb-3">
          <label className="form-label fw-semibold">NAME</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={form.name}
            onChange={handle}
          />
        </div>

        {/* EMAIL */}
        <div className="mb-3">
          <label className="form-label fw-semibold">EMAIL</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={form.email}
            onChange={handle}
          />
        </div>

        {/* MOBILE */}
        <div className="mb-3">
          <label className="form-label fw-semibold">MOBILE</label>
          <input
            type="text"
            name="mobile"
            className="form-control"
            value={form.mobile}
            onChange={handle}
            maxLength={10}
          />
        </div>

        {/* BIRTH DATE */}
        <div className="mb-3">
          <label className="form-label fw-semibold">BIRTH DATE</label>
          <input
            type="date"
            name="birthDate"
            className="form-control"
            value={form.birthDate}
            onChange={handle}
          />
        </div>

        {/* BUTTON */}
        <button
          className="btn btn-primary w-100"
          onClick={saveFaculty}
          disabled={loading}
        >
          {loading ? "Saving..." : "Add Faculty"}
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={1500} />
    </div>
  );
}
