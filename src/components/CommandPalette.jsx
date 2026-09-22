import { useState, useEffect, useContext } from "react";
import { CRMContext } from "../context/CRMContext";
import { useNavigate } from "react-router-dom";

export default function CommandPalette({ isOpen, onClose }) {
  const { clients, leads, tasks } = useContext(CRMContext);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onClose(!isOpen);
      }
      if (e.key === "Escape" && isOpen) {
        onClose(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const allLeads = Object.entries(leads).flatMap(([stage, list]) =>
    list.map((l) => ({ ...l, stage }))
  );

  const matchedClients = q
    ? clients.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.tags?.some((t) => t.toLowerCase().includes(q))
      )
    : clients.slice(0, 3);

  const matchedLeads = q
    ? allLeads.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          (l.description && l.description.toLowerCase().includes(q)) ||
          l.stage.toLowerCase().includes(q)
      )
    : allLeads.slice(0, 3);

  const matchedTasks = q
    ? tasks.filter(
        (t) =>
          (t.title && t.title.toLowerCase().includes(q)) ||
          (t.text && t.text.toLowerCase().includes(q)) ||
          (t.note && t.note.toLowerCase().includes(q))
      )
    : tasks.slice(0, 3);

  const handleSelectClient = (id) => {
    navigate(`/clients/${id}`);
    onClose(false);
    setQuery("");
  };

  const handleSelectLead = () => {
    navigate("/leads");
    onClose(false);
    setQuery("");
  };

  const handleSelectTask = () => {
    navigate("/tasks");
    onClose(false);
    setQuery("");
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(4px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "80px",
        zIndex: 99999,
      }}
      onClick={() => onClose(false)}
    >
      <div
        style={{
          width: "90%",
          maxWidth: "600px",
          backgroundColor: "#1e1e24",
          border: "1px solid #3b3b4f",
          borderRadius: "12px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: "16px",
            borderBottom: "1px solid #2d2d3a",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={{ fontSize: "18px" }}>🔍</span>
          <input
            type="text"
            placeholder="Search clients, leads, tasks... (Press ESC to exit)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#fff",
              fontSize: "16px",
            }}
          />
          <kbd
            style={{
              backgroundColor: "#2d2d3a",
              padding: "2px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              color: "#aaa",
            }}
          >
            ESC
          </kbd>
        </div>

        <div style={{ maxHeight: "350px", overflowY: "auto", padding: "12px" }}>
          {/* Quick Navigation Shortcuts */}
          {!q && (
            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "12px", color: "#888", marginBottom: "8px", fontWeight: "600" }}>
                QUICK NAVIGATION
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button
                  onClick={() => { navigate("/"); onClose(false); }}
                  style={{ padding: "6px 12px", background: "#2a2a36", border: "1px solid #3e3e50", color: "#4f46e5", borderRadius: "6px", cursor: "pointer" }}
                >
                  📊 Dashboard
                </button>
                <button
                  onClick={() => { navigate("/clients"); onClose(false); }}
                  style={{ padding: "6px 12px", background: "#2a2a36", border: "1px solid #3e3e50", color: "#38bdf8", borderRadius: "6px", cursor: "pointer" }}
                >
                  👥 Clients
                </button>
                <button
                  onClick={() => { navigate("/leads"); onClose(false); }}
                  style={{ padding: "6px 12px", background: "#2a2a36", border: "1px solid #3e3e50", color: "#34d399", borderRadius: "6px", cursor: "pointer" }}
                >
                  📈 Leads
                </button>
                <button
                  onClick={() => { navigate("/tasks"); onClose(false); }}
                  style={{ padding: "6px 12px", background: "#2a2a36", border: "1px solid #3e3e50", color: "#f43f5e", borderRadius: "6px", cursor: "pointer" }}
                >
                  ✅ Tasks
                </button>
              </div>
            </div>
          )}

          {/* Clients Section */}
          {matchedClients.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "12px", color: "#38bdf8", marginBottom: "6px", fontWeight: "600" }}>
                CLIENTS ({matchedClients.length})
              </div>
              {matchedClients.map((client) => (
                <div
                  key={client.id}
                  onClick={() => handleSelectClient(client.id)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#252530",
                    marginBottom: "4px",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#323242")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#252530")}
                >
                  <div>
                    <span style={{ fontWeight: "600", color: "#fff" }}>{client.name}</span>
                    <span style={{ fontSize: "12px", color: "#aaa", marginLeft: "10px" }}>{client.email}</span>
                  </div>
                  <span style={{ fontSize: "12px", color: "#666" }}>View Details →</span>
                </div>
              ))}
            </div>
          )}

          {/* Leads Section */}
          {matchedLeads.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "12px", color: "#34d399", marginBottom: "6px", fontWeight: "600" }}>
                LEADS ({matchedLeads.length})
              </div>
              {matchedLeads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={handleSelectLead}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#252530",
                    marginBottom: "4px",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#323242")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#252530")}
                >
                  <div>
                    <span style={{ fontWeight: "600", color: "#fff" }}>{lead.title}</span>
                    <span style={{ fontSize: "12px", color: "#aaa", marginLeft: "10px" }}>Stage: {lead.stage}</span>
                  </div>
                  <span style={{ fontSize: "11px", padding: "2px 6px", borderRadius: "4px", background: "#3b3b4f", color: "#34d399" }}>
                    {lead.priority}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Tasks Section */}
          {matchedTasks.length > 0 && (
            <div>
              <div style={{ fontSize: "12px", color: "#f43f5e", marginBottom: "6px", fontWeight: "600" }}>
                TASKS ({matchedTasks.length})
              </div>
              {matchedTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={handleSelectTask}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#252530",
                    marginBottom: "4px",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#323242")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#252530")}
                >
                  <div>
                    <span style={{ textDecoration: task.done ? "line-through" : "none", color: task.done ? "#888" : "#fff" }}>
                      {task.title || task.text}
                    </span>
                  </div>
                  <span style={{ fontSize: "12px", color: task.dueDate ? "#fbbf24" : "#666" }}>
                    {task.dueDate || "No Date"}
                  </span>
                </div>
              ))}
            </div>
          )}

          {q && matchedClients.length === 0 && matchedLeads.length === 0 && matchedTasks.length === 0 && (
            <div style={{ textAlign: "center", color: "#888", padding: "24px 0" }}>
              No matches found for "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
