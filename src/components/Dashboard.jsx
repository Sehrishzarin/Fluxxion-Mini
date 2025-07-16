import { useContext } from "react";
import { CRMContext } from "../context/CRMContext";
import './Dashboard.css'
export default function Dashboard() {
  const { clients, leads, tasks } = useContext(CRMContext);

  const totalLeads = Object.values(leads || {}).flat().length;
  const today = new Date().toISOString().slice(0, 10);
  const dueToday = tasks.filter((task) => task.dueDate === today);


  const allLeads = Object.values(leads).flat();
  const recentLeads = [...allLeads].slice(-3).reverse();

  const upcomingTasks = [...tasks]
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 3);

  return (
    <div className="dashboard">
      <h2>📊 Dashboard</h2>

      <div className="stats">
        <div className="card">
          <h3>👥 Clients</h3>
          <p>{clients.length}</p>
        </div>
        <div className="card">
          <h3>📈 Leads</h3>
          <p>{totalLeads}</p>
        </div>
        <div className="card">
          <h3>✅ Tasks Today</h3>
          <p>{dueToday.length}</p>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="dashboard-section">
        <h3>🆕 Recent Leads</h3>
        {recentLeads.length === 0 ? (
          <p>No recent leads.</p>
        ) : (
          <ul className="preview-list">
            {recentLeads.map((lead) => (
              <li key={lead.id}>
                <strong>{lead.title}</strong> — {lead.priority}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="dashboard-section">
        <h3>⏳ Upcoming Tasks</h3>
        {upcomingTasks.length === 0 ? (
          <p>No tasks scheduled.</p>
        ) : (
          <ul className="preview-list">
            {upcomingTasks.map((task) => (
              <li key={task.id}>
                <strong>{task.text}</strong> — Due: {task.dueDate}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
