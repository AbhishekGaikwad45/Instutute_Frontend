import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import api from "../Api/axiosInstance";

export default function BirthdayPopup() {

  const alreadyShownRef = useRef(false); // 🔐 LOCK

  useEffect(() => {
    if (alreadyShownRef.current) return; // ❌ stop second call
    alreadyShownRef.current = true;

    loadBirthdays();
  }, []);

  const toastOptions = {
    position: "top-center",
    autoClose: 15000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  };

  const loadBirthdays = async () => {
    try {
      const todayKey = new Date().toDateString();
      if (localStorage.getItem("birthdayShown") === todayKey) return;

      const student = JSON.parse(localStorage.getItem("student"));
      const user = JSON.parse(localStorage.getItem("user"));

      let role = "";
      let selfName = "";

      if (student) {
        role = "student";
        selfName = student.name;
      } else if (user?.role) {
        role = user.role;
        selfName = user.name;
      }

      const res = await api.get("/api/birthdays/today");
      const { students = [], faculty = [] } = res.data;

      let popupShown = false;

      if (role === "student") {
        if (students.some(s => s.name === selfName)) {
          toast.success(`🎉 Happy Birthday ${selfName}! `, toastOptions);
          popupShown = true;
        }
      }

      else if (role === "faculty") {
        if (faculty.some(f => f.name === selfName)) {
          toast.info(`🎉 Happy Birthday ${selfName}! `, toastOptions);
          popupShown = true;
        }
      }

      else if (role === "counselor") {
        students.forEach(s => {
          toast.success(`Student Birthday: ${s.name} `, toastOptions);
          popupShown = true;
        });
        faculty.forEach(f => {
          toast.info(`Faculty Birthday: ${f.name} `, toastOptions);
          popupShown = true;
        });
      }

      if (popupShown) {
        localStorage.setItem("birthdayShown", todayKey);
      }

    } catch (err) {
      console.error("Birthday popup error", err);
    }
  };

  return null;
}
