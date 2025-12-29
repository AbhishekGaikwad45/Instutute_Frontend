import React, { useEffect, useState } from "react";
import api from "../Api/axiosInstance";
import { toast } from "react-toastify";

export default function CounselorTasksPage() {

  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("ALL");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  // ================= LOAD ALL TASKS =================
  const loadTasks = async () => {
    try {
      const res = await api.get("/api/tasks/all");
      setTasks(res.data);
    } catch {
      toast.error("Failed to load tasks");
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // ================= CREATE TASK =================
  const createTask = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      await api.post("/api/tasks/add", {
        title,
        description,
        dueDate: dueDate || null
      });

      toast.success("Task added");
      setTitle("");
      setDescription("");
      setDueDate("");
      loadTasks();
    } catch {
      toast.error("Failed to add task");
    }
  };

  // ================= ACTIONS =================
  const markCompleted = async (id) => {
    await api.put(`/api/tasks/complete/${id}`);
    loadTasks();
  };

  

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    await api.delete(`/api/tasks/delete/${id}`);
    loadTasks();
  };

  // ================= FILTER =================
  const filteredTasks =
    filter === "ALL"
      ? tasks
      : tasks.filter(t => t.status === filter);

  return (
    <div className="container mt-4">

      <h3 className="fw-bold mb-3">📝 Counselor Tasks</h3>

      {/* ================= CREATE TASK ================= */}
      <div className="card p-3 mb-4 shadow-sm">
        <h5 className="mb-3">Create Task</h5>

        <input
          className="form-control mb-2"
          placeholder="Task Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <textarea
          className="form-control mb-2"
          placeholder="Task Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <input
          type="date"
          className="form-control mb-3"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
        />

        <button className="btn btn-primary" onClick={createTask}>
           Add Task
        </button>
      </div>

      {/* ================= FILTER BUTTONS ================= */}
      <div className="mb-3 d-flex gap-2">
        <button
          className={`btn btn-sm ${filter === "ALL" ? "btn-dark" : "btn-outline-dark"}`}
          onClick={() => setFilter("ALL")}
        >
          All
        </button>

        <button
          className={`btn btn-sm ${filter === "PENDING" ? "btn-warning" : "btn-outline-warning"}`}
          onClick={() => setFilter("PENDING")}
        >
          Pending
        </button>

        <button
          className={`btn btn-sm ${filter === "COMPLETED" ? "btn-success" : "btn-outline-success"}`}
          onClick={() => setFilter("COMPLETED")}
        >
          Completed
        </button>
      </div>

      {/* ================= TASK TABLE ================= */}
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Description</th>
            <th>Due Date</th>
            <th>Status</th>
            <th className="text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredTasks.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center text-muted">
                No tasks found
              </td>
            </tr>
          )}

          {filteredTasks.map((t, index) => (
            <tr key={t.id}>
              <td>{index + 1}</td>
              <td>{t.title}</td>
              <td>{t.description}</td>
              <td>{t.dueDate || "-"}</td>

              <td>
                <span
                  className={`badge ${
                    t.status === "COMPLETED"
                      ? "bg-success"
                      : "bg-warning text-dark"
                  }`}
                >
                  {t.status}
                </span>
              </td>

              <td className="d-flex gap-2 justify-content-center">
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => markCompleted(t.id)}
                >
                  Complete
                </button>

                

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteTask(t.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
