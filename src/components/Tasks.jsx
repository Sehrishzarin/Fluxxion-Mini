import { useContext, useState } from "react";
import { CRMContext } from "../context/CRMContext";
import "./Tasks.css";

export default function Tasks() {
  const { tasks, addTask, toggleTask, deleteTask, clients, leads } = useContext(CRMContext);
  
  const [form, setForm] = useState({
    title: "",
    note: "",
    assignedTo: "",
    dueDate: "",
  });

  const [filterStatus, setFilterStatus] = useState("All"); // 'All' | 'Active' | 'Completed' | 'Overdue'
  const [viewMode, setViewMode] = useState("list"); // 'list' | 'calendar'

  const todayStr = new Date().toISOString().slice(0, 10);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    addTask(form);
    setForm({ title: "", note: "", assignedTo: "", dueDate: "" });
  };

  const allLeads = Object.values(leads || {}).flat();

  const filteredTasks = tasks.filter((t) => {
    if (filterStatus === "Active") return !t.done;
    if (filterStatus === "Completed") return t.done;
    if (filterStatus === "Overdue") return !t.done && t.dueDate && t.dueDate < todayStr;
    return true;
  });

  // Calendar view helper (generate days of current month)
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
    const d = i + 1;
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const dayTasks = tasks.filter((t) => t.dueDate === dateStr);
    return { day: d, dateStr, dayTasks };
  });

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <div>
          <h2>✅ Tasks & Reminders</h2>
          <p style={{ color: "#9ca3af", fontSize: "0.85rem", marginTop: "2px" }}>
            Track client action items, scheduled calls, and follow-ups
          </p>
        </div>

        <div className="tasks-toolbar">
          <div className="status-tabs">
            {["All", "Active", "Completed", "Overdue"].map((status) => (
              <button
                key={status}
                className={`tab-btn ${filterStatus === status ? "active" : ""}`}
                onClick={() => setFilterStatus(status)}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="view-toggle-btns">
            <button
              className={`v-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
            >
              📋 List View
            </button>
            <button
              className={`v-btn ${viewMode === "calendar" ? "active" : ""}`}
              onClick={() => setViewMode("calendar")}
            >
              📅 Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Add Task Form */}
      <form onSubmit={handleAdd} className="task-form-panel">
        <h3>➕ Add Task or Reminder</h3>
        <div className="form-inline-grid">
          <input
            type="text"
            placeholder="Task Title (e.g. Prep Q4 presentation)"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Note / Details"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />
          <select
            value={form.assignedTo}
            onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
          >
            <option value="">Assign To...</option>
            {clients.map((c) => (
              <option key={c.id} value={`Client: ${c.name}`}>
                Client: {c.name}
              </option>
            ))}
            {allLeads.map((l) => (
              <option key={l.id} value={`Lead: ${l.title}`}>
                Lead: {l.title}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          />
          <button type="submit" className="btn-add-primary">
            Save Task
          </button>
        </div>
      </form>

      {/* Task List / Calendar View */}
      {viewMode === "list" ? (
        filteredTasks.length === 0 ? (
          <div style={{ textAlign: "center", color: "#6b7280", padding: "3rem 0" }}>
            No tasks match your selected filter ({filterStatus}).
          </div>
        ) : (
          <div className="tasks-list">
            {filteredTasks.map((t) => {
              const isOverdue = !t.done && t.dueDate && t.dueDate < todayStr;
              return (
                <div
                  key={t.id}
                  className={`task-card ${t.done ? "completed" : ""} ${isOverdue ? "overdue" : ""}`}
                >
                  <div className="task-left">
                    <input
                      type="checkbox"
                      className="task-checkbox"
                      checked={t.done}
                      onChange={() => toggleTask(t.id)}
                    />
                    <div>
                      <div
                        className="task-title"
                        style={{ textDecoration: t.done ? "line-through" : "none" }}
                      >
                        {t.title || t.text}
                      </div>
                      {t.note && <div className="task-note">🗒️ {t.note}</div>}
                      <div className="task-meta">
                        {t.assignedTo && <span className="assigned-pill">🔗 {t.assignedTo}</span>}
                        {t.dueDate && (
                          <span className={`due-pill ${isOverdue ? "urgent" : ""}`}>
                            📅 Due: {t.dueDate} {isOverdue && "(Overdue)"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    className="btn-icon"
                    onClick={() => deleteTask(t.id)}
                    style={{ color: "#ef4444" }}
                    title="Delete task"
                  >
                    🗑️
                  </button>
                </div>
              );
            })}
          </div>
        )
      ) : (
        <div className="calendar-grid-view">
          <h3 style={{ marginBottom: "1rem", color: "#2dd4bf" }}>
            📅 {now.toLocaleString("default", { month: "long" })} {year} Calendar
          </h3>
          <div className="calendar-days-header">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>
          <div className="calendar-month-grid">
            {calendarDays.map((cd) => {
              const isToday = cd.dateStr === todayStr;
              return (
                <div
                  key={cd.day}
                  className={`day-cell ${isToday ? "today-cell" : ""}`}
                >
                  <span className="day-num">{cd.day}</span>
                  <div className="cell-tasks">
                    {cd.dayTasks.map((t) => (
                      <div
                        key={t.id}
                        className={`cell-task-chip ${t.done ? "done" : ""}`}
                        onClick={() => toggleTask(t.id)}
                        title={`${t.title || t.text} (${t.done ? "Done" : "Pending"})`}
                      >
                        • {t.title || t.text}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
