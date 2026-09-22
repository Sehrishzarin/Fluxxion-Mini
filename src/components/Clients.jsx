import { useContext, useState } from "react";
import { CRMContext } from "../context/CRMContext";
import { useNavigate } from "react-router-dom";
import "./Clients.css";

export default function Clients() {
  const { clients, addClient, updateClient, deleteClient, leads } = useContext(CRMContext);
  
  const [form, setForm] = useState({ name: "", email: "", tags: "" });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table'
  const [sortField, setSortField] = useState("name"); // 'name' | 'email' | 'leads'

  const navigate = useNavigate();

  // Collect unique tags across all clients
  const allTags = Array.from(
    new Set(
      clients.flatMap((c) =>
        Array.isArray(c.tags)
          ? c.tags
          : typeof c.tags === "string" && c.tags.trim()
          ? c.tags.split(",").map((t) => t.trim())
          : []
      )
    )
  );

  const getClientLeadsCount = (clientId) => {
    return Object.values(leads || {})
      .flat()
      .filter((l) => Number(l.clientId) === Number(clientId)).length;
  };

  const filteredClients = clients
    .filter((client) => {
      const q = search.toLowerCase().trim();
      const tagsList = Array.isArray(client.tags)
        ? client.tags
        : typeof client.tags === "string"
        ? client.tags.split(",")
        : [];

      const matchesSearch =
        !q ||
        client.name.toLowerCase().includes(q) ||
        client.email.toLowerCase().includes(q) ||
        tagsList.some((t) => t.toLowerCase().includes(q));

      const matchesTag =
        selectedTag === "All" ||
        tagsList.some((t) => t.trim().toLowerCase() === selectedTag.toLowerCase());

      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      if (sortField === "name") return a.name.localeCompare(b.name);
      if (sortField === "email") return a.email.localeCompare(b.email);
      if (sortField === "leads") return getClientLeadsCount(b.id) - getClientLeadsCount(a.id);
      return 0;
    });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;

    const tags = form.tags
      ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    if (editingId !== null) {
      updateClient(editingId, { name: form.name, email: form.email, tags });
      setEditingId(null);
    } else {
      addClient({ name: form.name, email: form.email, tags });
    }

    setForm({ name: "", email: "", tags: "" });
  };

  const handleEdit = (client) => {
    const tagString = Array.isArray(client.tags)
      ? client.tags.join(", ")
      : client.tags || "";
    setForm({ name: client.name, email: client.email, tags: tagString });
    setEditingId(client.id);
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
    <div className="clients-container">
      <div className="clients-header">
        <div>
          <h2>👥 Clients Directory</h2>
          <p style={{ color: "#9ca3af", fontSize: "0.85rem", marginTop: "2px" }}>
            Manage client profiles, contacts, and quick lead history
          </p>
        </div>

        <div className="clients-toolbar">
          <input
            type="text"
            className="search-box"
            placeholder="🔍 Search clients or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="search-box"
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            style={{ minWidth: "140px" }}
          >
            <option value="name">Sort by Name</option>
            <option value="email">Sort by Email</option>
            <option value="leads">Sort by Leads</option>
          </select>

          <div className="view-toggle-btns">
            <button
              className={`v-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              🏓 Grid
            </button>
            <button
              className={`v-btn ${viewMode === "table" ? "active" : ""}`}
              onClick={() => setViewMode("table")}
            >
              📄 Table
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Tag Pill Filter */}
      {allTags.length > 0 && (
        <div className="tag-filter-bar">
          <span className="tag-filter-label">Filter by Tag:</span>
          <button
            className={`tag-pill-btn ${selectedTag === "All" ? "active" : ""}`}
            onClick={() => setSelectedTag("All")}
          >
            All Clients ({clients.length})
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`tag-pill-btn ${selectedTag === tag ? "active" : ""}`}
              onClick={() => setSelectedTag(tag)}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Add / Edit Client Form */}
      <form onSubmit={handleSubmit} className="client-form-panel">
        <h3>{editingId ? "✏️ Edit Client Profile" : "👤 Add New Client"}</h3>
        <div className="form-inline-grid">
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="tags"
            type="text"
            placeholder="Tags (comma separated: VIP, Enterprise)"
            value={form.tags}
            onChange={handleChange}
          />
          <button type="submit" className="btn-add-primary">
            {editingId ? "Update Client" : "Save Client"}
          </button>
          {editingId && (
            <button
              type="button"
              className="btn-cancel"
              onClick={() => {
                setEditingId(null);
                setForm({ name: "", email: "", tags: "" });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Clients Listing */}
      {filteredClients.length === 0 ? (
        <div style={{ textAlign: "center", color: "#6b7280", padding: "3rem 0" }}>
          No clients match your filter criteria.
        </div>
      ) : viewMode === "grid" ? (
        <div className="client-grid">
          {filteredClients.map((client) => {
            const tagsList = Array.isArray(client.tags)
              ? client.tags
              : client.tags
              ? client.tags.split(",")
              : [];

            const leadCount = getClientLeadsCount(client.id);

            return (
              <div key={client.id} className="client-card">
                <div className="client-avatar-row">
                  <div className="avatar-circle">{getInitials(client.name)}</div>
                  <div className="client-main-info">
                    <h4 onClick={() => navigate(`/clients/${client.id}`)}>{client.name}</h4>
                    <span className="client-email">{client.email}</span>
                  </div>
                </div>

                <div className="client-tags-row">
                  {tagsList.length > 0 ? (
                    tagsList.map((tag, idx) => (
                      <span key={idx} className="c-tag">
                        #{tag.trim()}
                      </span>
                    ))
                  ) : (
                    <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>No tags</span>
                  )}
                </div>

                <div className="client-card-foot">
                  <span className="leads-badge-count">📋 {leadCount} active leads</span>
                  <div>
                    <button
                      className="btn-icon"
                      onClick={() => handleEdit(client)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => deleteClient(client.id)}
                      title="Delete"
                      style={{ color: "#ef4444" }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <table className="modern-table">
          <thead>
            <tr>
              <th onClick={() => setSortField("name")}>Client Name ↕</th>
              <th onClick={() => setSortField("email")}>Email ↕</th>
              <th>Tags</th>
              <th onClick={() => setSortField("leads")}>Active Leads ↕</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => {
              const tagsList = Array.isArray(client.tags)
                ? client.tags
                : client.tags
                ? client.tags.split(",")
                : [];
              const leadCount = getClientLeadsCount(client.id);

              return (
                <tr key={client.id}>
                  <td
                    onClick={() => navigate(`/clients/${client.id}`)}
                    style={{ cursor: "pointer", fontWeight: "600", color: "#2dd4bf" }}
                  >
                    {client.name}
                  </td>
                  <td>{client.email}</td>
                  <td>
                    {tagsList.map((t, i) => (
                      <span key={i} className="c-tag" style={{ marginRight: "4px" }}>
                        #{t.trim()}
                      </span>
                    ))}
                  </td>
                  <td>{leadCount} leads</td>
                  <td>
                    <button
                      className="btn-icon"
                      onClick={() => handleEdit(client)}
                      style={{ marginRight: "8px" }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => deleteClient(client.id)}
                      style={{ color: "#ef4444" }}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
