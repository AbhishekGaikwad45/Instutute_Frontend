import React from "react";

export default function StudentSidebar({ activePage, setActivePage }) {
  const menuItems = [
    { key: "dashboard", label: "Dashboard" },
    { key: "batches", label: "My Batches" },
    { key: "attendance", label: "My Attendance" },
    { key: "materials", label: "Study Materials" },
    { key: "performance", label: "Marks Details" },
    { key: "leave", label: "Apply Leave" },
     { key: "profile", label: "Profile" },
  ];

  return (
    <div className="p-3">
      <h4 className="text-success mb-4">Student Panel</h4>

      <ul className="list-group">
        {menuItems.map((item) => (
          <li
            key={item.key}
            onClick={() => setActivePage(item.key)}
            className={`list-group-item list-group-item-action ${
              activePage === item.key ? "active" : ""
            }`}
            style={{ cursor: "pointer" }}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
