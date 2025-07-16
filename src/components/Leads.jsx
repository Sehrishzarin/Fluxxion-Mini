import { useContext, useState } from "react";
import { CRMContext } from "../context/CRMContext";

const stages = ["New", "Contacted", "Proposal", "Won"];
const priorities = ["High", "Medium", "Low"];

export default function Leads() {
  const { leads, setLeads, moveLead, clients } = useContext(CRMContext);
  const [form, setForm] = useState({
    title: "",
    description: "",
    clientId: "",
    priority: "Medium",
  });
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState("");

  const handleToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    const newLead = {
      ...form,
      id: Date.now(),
    };

    setLeads((prev) => ({
      ...prev,
      New: [...prev.New, newLead],
    }));

    setForm({
      title: "",
      description: "",
      clientId: "",
      priority: "Medium",
    });

    handleToast("✅ Lead added to 'New'");
  };

  const handleDelete = (stage, id) => {
    setLeads((prev) => ({
      ...prev,
      [stage]: prev[stage].filter((l) => l.id !== id),
    }));
    handleToast("🗑️ Lead deleted");
  };

  const handleEditSave = (stage, id, updated) => {
    setLeads((prev) => ({
      ...prev,
      [stage]: prev[stage].map((lead) =>
        lead.id === id ? { ...lead, ...updated } : lead
      ),
    }));
    setEditing(null);
    handleToast("✏️ Lead updated");
  };

  const handleDrop = (e, stage) => {
    const data = e.dataTransfer.getData("text");
    const [fromStage, leadId] = data.split(":");
    moveLead(fromStage, stage, Number(leadId));
    handleToast(`➡️ Moved to '${stage}'`);
  };

  const allowDrop = (e) => e.preventDefault();

  return (
    <div>
      <h2 style={{ fontSize: "24px", marginBottom: "1rem" }}>Leads</h2>

      {toast && (
        <div
          style={{
            backgroundColor: "#1e1e1e",
            padding: "10px",
            marginBottom: "1rem",
            borderLeft: "4px solid teal",
            borderRadius: "4px",
          }}
        >
          {toast}
        </div>
      )}

      <form onSubmit={handleAdd} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          style={{ padding: "6px", marginRight: "6px" }}
        />
        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          style={{ padding: "6px", marginRight: "6px" }}
        />
        <select
          value={form.clientId}
          onChange={(e) => setForm({ ...form, clientId: e.target.value })}
          style={{ marginRight: "6px" }}
        >
          <option value="">Assign to Client</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={form.priority}
          onChange={(e) => setForm({ ...form, priority: e.target.value })}
          style={{ marginRight: "6px" }}
        >
          {priorities.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <button type="submit" style={{ padding: "6px 12px" }}>
          Add
        </button>
      </form>

      <div style={{ display: "flex", gap: "16px", overflowX: "auto" }}>
        {stages.map((stage) => (
          <div
            key={stage}
            onDrop={(e) => handleDrop(e, stage)}
            onDragOver={allowDrop}
            style={{
              flex: 1,
              minWidth: "200px",
              backgroundColor: "#1c1c1c",
              padding: "1rem",
              border: "1px solid #333",
              borderRadius: "6px",
            }}
          >
            <h3 style={{ marginBottom: "10px", color: "#14b8a6" }}>{stage}</h3>
            {leads[stage].map((lead) => (
              <div
                key={lead.id}
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `${stage}:${lead.id}`)
                }
                style={{
                  backgroundColor: "#333",
                  marginBottom: "8px",
                  padding: "10px",
                  borderRadius: "4px",
                  cursor: "grab",
                }}
              >
                {editing === lead.id ? (
                  <>
                    <input
                      value={lead.title}
                      onChange={(e) =>
                        handleEditSave(stage, lead.id, { title: e.target.value })
                      }
                    />
                    <button onClick={() => setEditing(null)}>Save</button>
                  </>
                ) : (
                  <>
                    <strong>{lead.title}</strong>
                    <p style={{ fontSize: "14px", margin: "4px 0" }}>
                      {lead.description}
                    </p>
                    <p style={{ fontSize: "13px", color: "#aaa" }}>
                      Priority: <b>{lead.priority}</b> <br />
                      Client:{" "}
                      {
                        clients.find((c) => c.id === lead.clientId)?.name ||
                        "Unassigned"
                      }
                    </p>
                    <div style={{ marginTop: "6px" }}>
                      <button
                        onClick={() => setEditing(lead.id)}
                        style={{ marginRight: "6px" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(stage, lead.id)}
                        style={{ color: "red" }}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
