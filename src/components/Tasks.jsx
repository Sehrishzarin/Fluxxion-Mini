import { useContext, useState } from "react";
import { CRMContext } from "../context/CRMContext";

export default function Tasks() {
  const { tasks, setTasks, clients, leads } = useContext(CRMContext);
  const [form, setForm] = useState({
    title: "",
    note: "",
    assignedTo: "",
    dueDate: "",
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.title) return;

    const newTask = {
      id: Date.now(),
      ...form,
      done: false,
    };

    setTasks([...tasks, newTask]);

    setForm({ title: "", note: "", assignedTo: "", dueDate: "" });
  };

  const toggleDone = (id) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div>
      <h2 style={{ fontSize: "24px", marginBottom: "1rem" }}>Tasks & Notes</h2>

      <form onSubmit={handleAdd} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Task title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          style={{ padding: "6px", marginRight: "6px" }}
          required
        />
        <input
          type="text"
          placeholder="Sticky note"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          style={{ padding: "6px", marginRight: "6px" }}
        />
        <select
          value={form.assignedTo}
          onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
          style={{ marginRight: "6px" }}
        >
          <option value="">Assign to</option>
          {clients.map((c) => (
            <option key={c.id} value={c.name}>Client: {c.name}</option>
          ))}
          {Object.values(leads).flat().map((l) => (
            <option key={l.id} value={l.title}>Lead: {l.title}</option>
          ))}
        </select>
        <input
          type="date"
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          style={{ marginRight: "6px" }}
        />
        <button type="submit" style={{ padding: "6px 12px" }}>Add</button>
      </form>

      {tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tasks.map((task) => (
            <li
              key={task.id}
              style={{
                backgroundColor: task.done ? "#2c2c2c" : "#1e1e1e",
                borderLeft: task.done ? "4px solid lime" : "4px solid teal",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "4px",
              }}
            >
              <div>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleDone(task.id)}
                  style={{ marginRight: "10px" }}
                />
                <strong style={{ textDecoration: task.done ? "line-through" : "none" }}>
                  {task.title}
                </strong>
              </div>
              {task.note && <p style={{ margin: "6px 0" }}>🗒️ {task.note}</p>}
              {task.assignedTo && <p>🔗 Assigned to: {task.assignedTo}</p>}
              {task.dueDate && <p>📅 Due: {task.dueDate}</p>}
              <button onClick={() => deleteTask(task.id)} style={{ color: "red", marginTop: "6px" }}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
