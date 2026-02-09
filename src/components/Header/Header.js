export default function Header() {

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const counselor = storedUser?.data || storedUser || null;

  const counselorName =
    counselor?.fullName ||
    counselor?.name ||
    counselor?.firstName ||
    (counselor?.email ? counselor.email.split("@")[0] : "Counselor");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div
      style={{
        width: "100%",
        height: "60px",
        background: "#2563eb",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 2000,
      }}
    >
      <h4 className="m-0">Counselor Dashboard</h4>

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <h5 className="m-0">
          Welcome, <b>{counselorName}</b>
        </h5>

        <button
          onClick={handleLogout}
          style={{
            background: "#ef4444",
            border: "none",
            padding: "8px 14px",
            borderRadius: "6px",
            cursor: "pointer",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
