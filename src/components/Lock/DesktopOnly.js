
import React, { useEffect, useState } from "react";

export default function DesktopOnly({ children }) {
  const [allowed, setAllowed] = useState(true);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;

      // ❌ Mobile + Tablet block
      if (width < 1024) {
        setAllowed(false);
      } else {
        setAllowed(true);
      }
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  if (!allowed) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0d1b2a",
          color: "white",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <div>
          <h1>🚫 Mobile Access Disabled</h1>
          <p style={{ fontSize: "18px", marginTop: "10px" }}>
            This application is designed for Desktop / Laptop only.
          </p>
          <p style={{ opacity: 0.7 }}>
            Please open this site on a larger screen.
          </p>
        </div>
      </div>
    );
  }

  return children;
}
