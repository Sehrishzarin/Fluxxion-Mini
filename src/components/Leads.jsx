import { useContext, useState } from "react";
import { CRMContext } from "../context/CRMContext";
import "./Leads.css";

const stages = ["New", "Contacted", "Proposal", "Won"];
const priorities = ["High", "Medium", "Low"];

const stageColors = {
  New: "#38bdf8",
  Contacted: "#f59e0b",
  Proposal: "#a855f7",
  Won: "#10b981",
};

export default function Leads() {
  const { leads, moveLead, addLead, updateLead, deleteLead, clients } = useContext(CRMContext);
  
  const [form, setForm] = useState({
    title: "",
    description: "",
    clientId: "",
    priority: "Medium",
  });

  const [search, setSearch] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [dragOverStage, setDragOverStage] = useState(null);
  const [editingLead, setEditingLead] = useState(null); // { stage, lead }

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    addLead(form, "New");
    setForm({
      title: "",
      description: "",
      clientId: "",
      priority: "Medium",
    });
  };

  const handleDragStart = (e, stage, leadId) => {
    e.dataTransfer.setData("text/plain", `${stage}:${leadId}`);
  };

  const handleDragOver = (e, stage) => {
    e.preventDefault();
    if (dragOverStage !== stage) setDragOverStage(stage);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = (e, targetStage) => {
    e.preventDefault();
    setDragOverStage(null);
    const data = e.dataTransfer.getData("text/plain");
    if (!data) return;
    const [fromStage, leadId] = data.split(":");
    moveLead(fromStage, targetStage, Number(leadId));
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingLead) return;
    const { stage, lead } = editingLead;
    updateLead(stage, lead.id, lead);
    setEditingLead(null);
  };

  // Filter helper
  const filterLead = (lead) => {
    const q = search.toLowerCase().trim();
    const matchesQuery =
      !q ||
      lead.title.toLowerCase().includes(q) ||
      (lead.description && lead.description.toLowerCase().includes(q));

    const matchesPriority =
      selectedPriority === "All" || lead.priority === selectedPriority;

    return matchesQuery && matchesPriority;
  };

  return (
    <div className="leads-container">
      <div className="leads-header-row">
        <div>
          <h2>📈 Leads Pipeline</h2>
          <p style={{ color: "#9ca3af", fontSize: "0.85rem", marginTop: "2px" }}>
            Drag and drop cards across columns or use quick movers
          </p>
        </div>

        <div className="leads-controls">
          <input
            type="text"
            className="leads-search-input"
            placeholder="🔍 Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="priority-filter-group">
            {["All", ...priorities].map((p) => (
              <button
                key={p}
                className={`p-filter-btn ${selectedPriority === p ? "active" : ""}`}
                onClick={() => setSelectedPriority(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add Lead Panel */}
      <form onSubmit={handleAdd} className="add-lead-card-form">
        <h3>➕ Add New Lead</h3>
        <div className="form-inline-grid">
          <input
            type="text"
            placeholder="Lead Title (e.g. Mobile App Redesign)"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Description / Context"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <select
            value={form.clientId}
            onChange={(e) => setForm({ ...form, clientId: e.target.value })}
          >
            <option value="">Assign to Client...</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
          >
            {priorities.map((p) => (
              <option key={p} value={p}>
                {p} Priority
              </option>
            ))}
          </select>
          <button type="submit" className="btn-add-primary">
            Save Lead
          </button>
        </div>
      </form>

      {/* Kanban Board Grid */}
      <div className="kanban-board">
        {stages.map((stage) => {
          const list = (leads[stage] || []).filter(filterLead);
          const totalInStage = (leads[stage] || []).length;
          const isOver = dragOverStage === stage;

          return (
            <div
              key={stage}
              className={`kanban-column ${isOver ? "drag-over" : ""}`}
              onDragOver={(e) => handleDragOver(e, stage)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage)}
            >
              <div className="column-header">
                <h3 style={{ color: stageColors[stage] }}>
                  <span>●</span> {stage}
                </h3>
                <span className="col-count">{totalInStage}</span>
              </div>

              <div className="cards-list">
                {list.map((lead) => {
                  const assignedClient = clients.find(
                    (c) => Number(c.id) === Number(lead.clientId)
                  );

                  return (
                    <div
                      key={lead.id}
                      className="lead-card"
                      draggable
                      onDragStart={(e) => handleDragStart(e, stage, lead.id)}
                    >
                      <div className="lead-card-top">
                        <span className="lead-card-title">{lead.title}</span>
                        <span className={`p-pill p-${lead.priority}`}>
                          {lead.priority}
                        </span>
                      </div>

                      {lead.description && (
                        <p className="lead-card-desc">{lead.description}</p>
                      )}

                      <div className="lead-card-meta">
                        <span>👤 Client: {assignedClient ? assignedClient.name : "Unassigned"}</span>
                      </div>

                      <div className="lead-card-actions">
                        <select
                          className="stage-select-quick"
                          value={stage}
                          onChange={(e) => moveLead(stage, e.target.value, lead.id)}
                          title="Move stage"
                        >
                          {stages.map((s) => (
                            <option key={s} value={s}>
                              → {s}
                            </option>
                          ))}
                        </select>

                        <div className="card-btn-group">
                          <button
                            className="btn-icon"
                            onClick={() => setEditingLead({ stage, lead: { ...lead } })}
                            title="Edit Lead"
                          >
                            ✏️
                          </button>
                          <button
                            className="btn-icon"
                            onClick={() => deleteLead(stage, lead.id)}
                            title="Delete Lead"
                            style={{ color: "#ef4444" }}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {list.length === 0 && (
                  <div
                    style={{
                      textAlign: "center",
                      color: "#6b7280",
                      padding: "2rem 0",
                      fontSize: "0.85rem",
                      fontStyle: "italic",
                    }}
                  >
                    No leads in {stage}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Lead Modal */}
      {editingLead && (
        <div className="modal-overlay" onClick={() => setEditingLead(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>✏️ Edit Lead</h3>
              <button className="modal-close-btn" onClick={() => setEditingLead(null)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="modal-form">
              <input
                type="text"
                value={editingLead.lead.title}
                onChange={(e) =>
                  setEditingLead({
                    ...editingLead,
                    lead: { ...editingLead.lead, title: e.target.value },
                  })
                }
                required
              />
              <textarea
                value={editingLead.lead.description || ""}
                onChange={(e) =>
                  setEditingLead({
                    ...editingLead,
                    lead: { ...editingLead.lead, description: e.target.value },
                  })
                }
                rows="3"
              />
              <select
                value={editingLead.lead.clientId || ""}
                onChange={(e) =>
                  setEditingLead({
                    ...editingLead,
                    lead: { ...editingLead.lead, clientId: e.target.value },
                  })
                }
              >
                <option value="">Assign to Client...</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <select
                value={editingLead.lead.priority}
                onChange={(e) =>
                  setEditingLead({
                    ...editingLead,
                    lead: { ...editingLead.lead, priority: e.target.value },
                  })
                }
              >
                {priorities.map((p) => (
                  <option key={p} value={p}>
                    {p} Priority
                  </option>
                ))}
              </select>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setEditingLead(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
