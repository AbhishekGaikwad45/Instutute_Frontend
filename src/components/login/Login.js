import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../Api/axiosInstance"; 

export default function Login() {
  const nav = useNavigate();

  const [role, setRole] = useState("student");
  const [loginType, setLoginType] = useState("normal");

  const [emailOrId, setEmailOrId] = useState("");
  const [password, setPassword] = useState("");
  const [facultyDate, setFacultyDate] = useState("");
  const [otp, setOtp] = useState("");

  const [sendingOtp, setSendingOtp] = useState(false);
  const [timer, setTimer] = useState(0);

  // ===================== TIMER =====================
  useEffect(() => {
    if (timer <= 0) return;
    const t = setInterval(() => setTimer((sec) => sec - 1), 1000);
    return () => clearInterval(t);
  }, [timer]);

  // ===================== EMAIL EXIST CHECK =====================
  const checkEmailExist = async () => {
    try {
      let url = "";

      if (role === "student") {
        url = `/api/student/check/${emailOrId}`;
      } else if (role === "faculty") {
        url = `/api/faculty/check-email?email=${emailOrId}`;
      } else if (role === "counselor") {
        url = `/api/auth/check/${emailOrId}`;
      }

      const res = await api.get(url);
      return res.data?.exists === true;
    } catch {
      return false;
    }
  };

  // ===================== SEND OTP =====================
  const sendEmailOtp = async () => {
    if (!emailOrId) return toast.warning("Please enter email!");

    const exists = await checkEmailExist();
    if (!exists) return toast.error("Email not registered for this role ❌");

    try {
      setSendingOtp(true);

      await api.post("/api/auth/send-email-otp", {
        email: emailOrId,
      });

      toast.success("OTP Sent Successfully! 📩");
      setTimer(60);
    } catch (err) {
      toast.error(err.response?.data || "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  // ===================== VERIFY OTP =====================
  const verifyEmailOtp = async () => {
    if (!otp) return toast.warning("Enter OTP!");

    try {
      const res = await api.post("/api/auth/verify-email-otp", {
        email: emailOrId,
        otp,
      });

      const data = res.data;

      toast.success("OTP Verified Successfully! 🎉");

      if (data.role === "student") {
        localStorage.setItem("student", JSON.stringify(data.data));
        return nav("/student-dashboard");
      }

      if (data.role === "faculty") {
        localStorage.setItem("user", JSON.stringify({ role: "faculty", data: data.data }));
        return nav("/faculty-dashboard");
      }

      if (data.role === "counselor") {
        localStorage.setItem(
          "user",
          JSON.stringify({ role: "counselor", data: data.data })
        );
        return nav("/counselor-dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Invalid OTP");
    }
  };

  // ===================== NORMAL LOGIN =====================
  const loginNow = async () => {
    if (!emailOrId) return toast.warning("Enter required fields!");

    try {
      // STUDENT LOGIN
      if (role === "student") {
        const res = await api.post("/api/student/login", {
          studentId: emailOrId,
          birthDate: password,
        });

        toast.success("Student Login Successful 🎉");
        localStorage.setItem("student", JSON.stringify(res.data));
        return nav("/student-dashboard");
      }

      // FACULTY LOGIN
      if (role === "faculty") {
        const res = await api.post("/api/faculty/login", {
          email: emailOrId.toLowerCase(),
          birthDate: facultyDate,
        });

        toast.success("Faculty Login Successful 🎉");

        // 🔥 VERY IMPORTANT
        localStorage.setItem("token", res.data.token); 

        localStorage.setItem(
          "user",
          JSON.stringify({
            role: "faculty",
            data: res.data, // 👈 ONLY faculty object
          })
        );

        return nav("/faculty-dashboard");
      }


      // COUNSELOR LOGIN
      if (role === "counselor") {
        const res = await api.post("/api/auth/login", {
          email: emailOrId,
          password,
        });

        toast.success("Counselor Login Successful 🎉");
        localStorage.setItem(
          "user",
          JSON.stringify({ 
            role: "counselor",
             data: res.data 
            })
        );
        return nav("/counselor-dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="card shadow p-4" style={{ width: "420px" }}>
        <h2 className="text-center mb-4 fw-bold text-primary">Login</h2>

        {/* ROLE */}
        <label className="fw-semibold">Select Role</label>
        <select
          className="form-select mb-3"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
          <option value="counselor">Counselor</option>
        </select>

        {/* LOGIN TYPE */}
        <label className="fw-semibold">Login Method</label>
        <select
          className="form-select mb-3"
          value={loginType}
          onChange={(e) => setLoginType(e.target.value)}
        >
          <option value="normal">ID / Password Login</option>
          <option value="email">Email OTP Login</option>
        </select>

        {/* NORMAL LOGIN */}
        {loginType === "normal" && (
          <>
            <label className="fw-semibold">
              {role === "student" ? "Student ID" : "Email"}
            </label>
            <input
              className="form-control mb-3"
              onChange={(e) => setEmailOrId(e.target.value)}
            />

            {role !== "counselor" && (
              <>
                <label className="fw-semibold">Birth Date</label>
                <input
                  type="date"
                  className="form-control mb-3"
                  onChange={(e) =>
                    role === "student"
                      ? setPassword(e.target.value)
                      : setFacultyDate(e.target.value)
                  }
                />
              </>
            )}

            {role === "counselor" && (
              <>
                <label className="fw-semibold">Password</label>
                <input
                  type="password"
                  className="form-control mb-3"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </>
            )}

            <button
              className="btn btn-primary w-100 fw-bold"
              onClick={loginNow}
            >
              Login
            </button>
          </>
        )}

        {/* OTP LOGIN */}
        {loginType === "email" && (
          <>
            <label className="fw-semibold">Email</label>
            <input
              type="email"
              className="form-control mb-3"
              onChange={(e) => setEmailOrId(e.target.value)}
            />

            <button
              className="btn btn-secondary w-100 mb-3 fw-bold"
              disabled={sendingOtp || timer > 0}
              onClick={sendEmailOtp}
            >
              {sendingOtp
                ? "Sending..."
                : timer > 0
                  ? `Resend in ${timer}s`
                  : "Send OTP"}
            </button>

            <label className="fw-semibold">Enter OTP</label>
            <input
              className="form-control mb-3"
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              className="btn btn-primary w-100 fw-bold"
              onClick={verifyEmailOtp}
            >
              Verify OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
}
