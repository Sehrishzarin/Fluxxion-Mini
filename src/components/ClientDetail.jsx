import { useParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CRMContext } from "../context/CRMContext";

export default function ClientDetail() {
  const { clients, leads } = useContext(CRMContext);

  const { id } = useParams();
  const navigate = useNavigate();

  const client = clients.find((c) => c.id === Number(id));
  if (!client) return <p>Client not found.</p>;

  const allLeads = Object.values(leads).flat();
  const clientLeads = allLeads.filter(
    (lead) => parseInt(lead.clientId) === parseInt(client.id)
  );

  return (
    <div>
      <h2 style={{ fontSize: "24px", marginBottom: "0.5rem" }}>{client.name}</h2>
      <p>Email: {client.email}</p>
      <p>Tags: {client.tags?.join(", ") || "None"}</p>

      <hr style={{ margin: "1rem 0" }} />

      <h3>📋 Leads for {client.name}</h3>
      {clientLeads.length === 0 ? (
        <p>No leads assigned to this client.</p>
      ) : (
        <ul style={{ paddingLeft: 0, listStyle: "none" }}>
          {clientLeads.map((lead) => (
            <li
              key={lead.id}
              style={{
                backgroundColor: "#222",
                marginBottom: "8px",
                padding: "10px",
                borderLeft: "4px solid teal",
                borderRadius: "4px",
              }}
            >
              <strong>{lead.title}</strong>
              <p style={{ margin: "4px 0" }}>{lead.description}</p>
              <p>Priority: {lead.priority}</p>
            </li>
          ))}
        </ul>
      )}

      <button onClick={() => navigate(-1)} style={{ marginTop: "1rem" }}>
        ← Back
      </button>
    </div>
  );
}
