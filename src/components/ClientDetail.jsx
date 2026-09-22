import { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CRMContext } from "../context/CRMContext";

export default function ClientDetail() {
  const { clients, leads, moveLead, tasks, addTask, toggleTask } = useContext(CRMContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");

  const client = clients.find((c) => c.id === Number(id));
  if (!client) {
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>
        <h3>Client not found.</h3>
        <button
          onClick={() => navigate("/clients")}
          style={{
            marginTop: "1rem",
            padding: "8px 16px",
            background: "#0d9488",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          ← Return to Clients Directory
        </button>
      </div>
    );
  }

  const allLeads = Object.entries(leads).flatMap(([stage, list]) =>
    list.map((l) => ({ ...l, stage }))
  );

  const clientLeads = allLeads.filter(
    (lead) => Number(lead.clientId) === Number(client.id)
  );

  const clientTasks = tasks.filter(
    (t) => t.assignedTo === `Client: ${client.name}` || t.assignedTo === client.name
  );

  const tagsList = Array.isArray(client.tags)
    ? client.tags
    : client.tags
    ? client.tags.split(",")
    : [];

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask({
      title: newTaskTitle,
      assignedTo: `Client: ${client.name}`,
      dueDate: newTaskDueDate,
      note: `Added directly from ${client.name}'s profile`,
    });
    setNewTaskTitle("");
    setNewTaskDueDate("");
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header / Profile Card */}
      <div
        style={{
          background: "#1e2230",
          border: "1px solid #2a2f42",
          borderRadius: "12px",
          padding: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #0d9488 0%, #0284c7 100%)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.4rem",
              fontWeight: "700",
            }}
          >
            {getInitials(client.name)}
          </div>
          <div>
            <h2 style={{ fontSize: "1.5rem", color: "#fff" }}>{client.name}</h2>
            <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>📧 {client.email}</p>
            <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
              {tagsList.map((tag, idx) => (
                <span
                  key={idx}
                  style={{
                    background: "#272d3d",
                    color: "#2dd4bf",
                    fontSize: "0.75rem",
                    padding: "2px 8px",
                    borderRadius: "10px",
                  }}
                >
                  #{tag.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/clients")}
          style={{
            padding: "8px 16px",
            background: "#272d3d",
            color: "#fff",
            border: "1px solid #3b3b4f",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          ← Back to Clients
        </button>
      </div>

      {/* Main Grid: Associated Leads & Client Tasks */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {/* Associated Leads Column */}
        <div
          style={{
            background: "#1e2230",
            border: "1px solid #2a2f42",
            borderRadius: "12px",
            padding: "1.25rem",
          }}
        >
          <h3 style={{ fontSize: "1.1rem", color: "#2dd4bf", marginBottom: "1rem" }}>
            📈 Associated Leads ({clientLeads.length})
          </h3>

          {clientLeads.length === 0 ? (
            <p style={{ color: "#6b7280", fontStyle: "italic", fontSize: "0.9rem" }}>
              No leads currently linked to this client.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {clientLeads.map((lead) => (
                <div
                  key={lead.id}
                  style={{
                    background: "#141721",
                    border: "1px solid #2a2f42",
                    borderRadius: "8px",
                    padding: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <strong style={{ color: "#fff", fontSize: "0.95rem" }}>{lead.title}</strong>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        background: "#272d3d",
                        color: "#fbbf24",
                      }}
                    >
                      {lead.priority}
                    </span>
                  </div>

                  {lead.description && (
                    <p style={{ fontSize: "0.85rem", color: "#9ca3af", margin: "6px 0" }}>
                      {lead.description}
                    </p>
                  )}

                  <div
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                      Stage: <b style={{ color: "#2dd4bf" }}>{lead.stage}</b>
                    </span>
                    <select
                      value={lead.stage}
                      onChange={(e) => moveLead(lead.stage, e.target.value, lead.id)}
                      style={{
                        background: "#1e2230",
                        border: "1px solid #2a2f42",
                        color: "#fff",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        fontSize: "0.75rem",
                      }}
                    >
                      {["New", "Contacted", "Proposal", "Won"].map((s) => (
                        <option key={s} value={s}>
                          Move to {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tasks & Reminders Column */}
        <div
          style={{
            background: "#1e2230",
            border: "1px solid #2a2f42",
            borderRadius: "12px",
            padding: "1.25rem",
          }}
        >
          <h3 style={{ fontSize: "1.1rem", color: "#38bdf8", marginBottom: "1rem" }}>
            ✅ Tasks & Reminders ({clientTasks.length})
          </h3>

          <form onSubmit={handleCreateTask} style={{ display: "flex", gap: "8px", marginBottom: "1rem" }}>
            <input
              type="text"
              placeholder="Quick task for this client..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              style={{
                flex: 1,
                background: "#141721",
                border: "1px solid #2a2f42",
                color: "#fff",
                padding: "8px 12px",
                borderRadius: "6px",
                fontSize: "0.85rem",
              }}
              required
            />
            <input
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              style={{
                background: "#141721",
                border: "1px solid #2a2f42",
                color: "#fff",
                padding: "8px",
                borderRadius: "6px",
                fontSize: "0.85rem",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "8px 12px",
                background: "#0284c7",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Add
            </button>
          </form>

          {clientTasks.length === 0 ? (
            <p style={{ color: "#6b7280", fontStyle: "italic", fontSize: "0.9rem" }}>
              No tasks assigned specifically to {client.name}.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {clientTasks.map((t) => (
                <div
                  key={t.id}
                  style={{
                    background: "#141721",
                    border: "1px solid #2a2f42",
                    borderRadius: "6px",
                    padding: "10px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => toggleTask(t.id)}
                    style={{ cursor: "pointer" }}
                  />
                  <div style={{ flex: 1 }}>
                    <span
                      style={{
                        color: t.done ? "#6b7280" : "#fff",
                        textDecoration: t.done ? "line-through" : "none",
                        fontSize: "0.9rem",
                        fontWeight: "500",
                      }}
                    >
                      {t.title || t.text}
                    </span>
                    {t.dueDate && (
                      <span style={{ fontSize: "0.75rem", color: "#9ca3af", marginLeft: "10px" }}>
                        📅 {t.dueDate}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
