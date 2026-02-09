import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import api from "../Api/axiosInstance";

export default function AddStudent() {

  const emptyForm = {
    name: "",
    fatherName: "",
    birthDate: "",
    mobile: "",
    parentContact: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    nativePlace: "",
    state: "",
    qualification: "",
    passOutYear: "",
    anyOtherCertification: "",
    courseEnrolledFor: "",
    admissionDate: "",
    totalFees: "",
    downPayment: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [courseList, setCourseList] = useState([]);

  const statesList = [
    "Maharashtra","Karnataka","Gujarat","Madhya Pradesh",
    "Uttar Pradesh","Rajasthan","Delhi","Haryana",
    "Punjab","Telangana","Tamil Nadu","West Bengal",
    "Bihar","Odisha","Kerala"
  ];

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const res = await api.get("/api/course/all");
      setCourseList(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to load courses");
    }
  };

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= VALIDATIONS =================
  const isValidMobile = (m) => /^[0-9]{10}$/.test(m);
  const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  // ================= DUPLICATE CHECK =================
  const checkEmailExist = async (email) => {
    const res = await api.get("/api/student/check-email", { params: { email } });
    return res.data;
  };

  const checkMobileExist = async (mobile) => {
    const res = await api.get("/api/student/check-mobile", { params: { mobile } });
    return res.data;
  };

  // ================= SAVE STUDENT =================
  const saveStudent = async () => {

    if (!form.name || !form.mobile || !form.email || !form.admissionDate) {
      toast.error("Please fill required fields (*)");
      return;
    }

    if (!isValidMobile(form.mobile)) {
      toast.error("Mobile must be 10 digits");
      return;
    }

    if (form.parentContact && !isValidMobile(form.parentContact)) {
      toast.error("Parent contact must be 10 digits");
      return;
    }

    if (!isValidEmail(form.email)) {
      toast.error("Invalid email format");
      return;
    }

    if (await checkEmailExist(form.email)) {
      toast.error("Email already exists");
      return;
    }

    if (await checkMobileExist(form.mobile)) {
      toast.error("Mobile already exists");
      return;
    }

    try {
      const res = await api.post("/api/student/add", form);

      toast.success(`Student Added 🎉 ID: ${res.data.studentId}`);
      setForm(emptyForm);

    } catch {
      toast.error("Failed to add student");
    }
  };

  // ================= UI =================
  const input = (label, name, type="text", required=false) => (
    <div className="mb-3">
      <label className="form-label">{label} {required && "*"}</label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handle}
        className="form-control"
      />
    </div>
  );

  return (
    <div className="container mt-4">
      <div className="card shadow p-4" style={{ maxWidth: 1000, margin: "auto" }}>
        <h3 className="text-center fw-bold mb-4">Add Student</h3>

        {input("Name", "name", "text", true)}
        {input("Father Name", "fatherName")}
        {input("Birth Date", "birthDate", "date")}

        {/* MOBILE */}
        <div className="mb-3">
          <label className="form-label">Mobile *</label>
          <input
            type="text"
            className="form-control"
            value={form.mobile}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "");
              if (v.length <= 10) setForm({ ...form, mobile: v });
            }}
          />
        </div>

        {/* PARENT CONTACT */}
        <div className="mb-3">
          <label className="form-label">Parent Contact</label>
          <input
            type="text"
            className="form-control"
            value={form.parentContact}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "");
              if (v.length <= 10) setForm({ ...form, parentContact: v });
            }}
          />
        </div>

        {input("Email", "email", "email", true)}
        {input("Address Line 1", "addressLine1")}
        {input("Address Line 2", "addressLine2")}
        {input("Native Place", "nativePlace")}

        {/* STATE */}
        <div className="mb-3">
          <label className="form-label">State</label>
          <select
            name="state"
            className="form-select"
            value={form.state}
            onChange={handle}
          >
            <option value="">Select State</option>
            {statesList.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {input("Qualification", "qualification")}
        {input("Pass Out Year", "passOutYear", "number")}
        {input("Other Certification", "anyOtherCertification")}

        {/* COURSE */}
        <div className="mb-3">
          <label className="form-label">Course Enrolled For</label>
          <select
            name="courseEnrolledFor"
            className="form-select"
            value={form.courseEnrolledFor}
            onChange={handle}
          >
            <option value="">Select Course</option>
            {courseList.map(c =>
              <option key={c.id} value={c.courseName}>{c.courseName}</option>
            )}
          </select>
        </div>

        {input("Admission Date", "admissionDate", "date", true)}
        {input("Total Fees", "totalFees", "number")}
        {input("Down Payment", "downPayment", "number")}

        <button className="btn btn-primary w-100 mt-3" onClick={saveStudent}>
          Add Student
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}
