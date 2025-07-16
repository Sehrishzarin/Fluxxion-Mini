import { useContext, useState } from "react";
import { CRMContext } from "../context/CRMContext";
import { useNavigate } from "react-router-dom";

export default function Clients() {
  const { clients, setClients, updateClient } = useContext(CRMContext);
  const [form, setForm] = useState({ name: "", email: "", tags: "" });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.email.toLowerCase().includes(search.toLowerCase()) ||
      (client.tags || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;

    const tags = form.tags.split(",").map((tag) => tag.trim());

    if (editingId !== null) {
      updateClient(editingId, { ...form, id: editingId, tags });
      setEditingId(null);
    } else {
      setClients([
        ...clients,
        { id: Date.now(), ...form, tags },
      ]);
    }

    setForm({ name: "", email: "", tags: "" });
  };

  const handleDelete = (id) => {
    setClients(clients.filter((c) => c.id !== id));
  };

  const handleEdit = (client) => {
    setForm({ name: client.name, email: client.email, tags: client.tags?.join(", ") || "" });
    setEditingId(client.id);
  };

  return (
    <div>
      <h2 style={{ fontSize: "24px", marginBottom: "1rem" }}>Clients</h2>

      <input
        type="text"
        placeholder="Search clients..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "1rem", padding: "6px", width: "100%" }}
      />

      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <input
          name="name"
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ padding: "6px", marginRight: "8px" }}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={{ padding: "6px", marginRight: "8px" }}
        />
        <input
          name="tags"
          type="text"
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={handleChange}
          style={{ padding: "6px", marginRight: "8px" }}
        />
        <button type="submit" style={{ padding: "6px 12px" }}>
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      {filteredClients.length === 0 ? (
        <p>No matching clients.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr key={client.id}>
                <td onClick={() => navigate(`/clients/${client.id}`)} style={{ cursor: "pointer", textDecoration: "underline" }}>{client.name}</td>
                <td>{client.email}</td>
                <td>{client.tags?.join(", ")}</td>
                <td>
                  <button onClick={() => handleEdit(client)} style={{ marginRight: "6px" }}>Edit</button>
                  <button onClick={() => handleDelete(client.id)} style={{ color: "red" }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
