import { useContext, useState } from "react";
import { CRMContext } from "../context/CRMContext";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const { clients, leads, tasks, activities, addLead, addClient, addTask } = useContext(CRMContext);
  const navigate = useNavigate();

  // Quick Action Modal State
  const [modalType, setModalType] = useState(null); // 'lead' | 'client' | 'task' | null
  const [leadForm, setLeadForm] = useState({ title: "", description: "", priority: "Medium", clientId: "" });
  const [clientForm, setClientForm] = useState({ name: "", email: "", tags: "" });
  const [taskForm, setTaskForm] = useState({ title: "", note: "", assignedTo: "", dueDate: "" });

  const totalLeads = Object.values(leads || {}).flat().length;
  const wonLeadsCount = (leads.Won || []).length;
  const conversionRate = totalLeads ? Math.round((wonLeadsCount / totalLeads) * 100) : 0;

  const today = new Date().toISOString().slice(0, 10);
  const dueToday = tasks.filter((t) => t.dueDate === today);
  const completedTasks = tasks.filter((t) => t.done).length;
  const taskProgress = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const allLeads = Object.entries(leads).flatMap(([stage, list]) =>
    list.map((l) => ({ ...l, stage }))
  );

  const upcomingTasks = [...tasks]
    .filter((t) => !t.done)
    .sort((a, b) => new Date(a.dueDate || "9999-12-31") - new Date(b.dueDate || "9999-12-31"))
    .slice(0, 4);

  const stageCounts = {
    New: (leads.New || []).length,
    Contacted: (leads.Contacted || []).length,
    Proposal: (leads.Proposal || []).length,
    Won: (leads.Won || []).length,
  };

  const stageColors = {
    New: "#38bdf8",
    Contacted: "#f59e0b",
    Proposal: "#a855f7",
    Won: "#10b981",
  };

  const handleCreateLead = (e) => {
    e.preventDefault();
    if (!leadForm.title.trim()) return;
    addLead(leadForm, "New");
    setLeadForm({ title: "", description: "", priority: "Medium", clientId: "" });
    setModalType(null);
  };

  const handleCreateClient = (e) => {
    e.preventDefault();
    if (!clientForm.name.trim() || !clientForm.email.trim()) return;
    const tags = clientForm.tags ? clientForm.tags.split(",").map((t) => t.trim()) : [];
    addClient({ name: clientForm.name, email: clientForm.email, tags });
    setClientForm({ name: "", email: "", tags: "" });
    setModalType(null);
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;
    addTask(taskForm);
    setTaskForm({ title: "", note: "", assignedTo: "", dueDate: "" });
    setModalType(null);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2>📊 Executive Dashboard</h2>
          <p className="subtitle">Real-time performance metrics & quick management</p>
        </div>
        <div className="quick-actions-bar">
          <button className="qa-btn qa-lead" onClick={() => setModalType("lead")}>
            ➕ Add Lead
          </button>
          <button className="qa-btn qa-client" onClick={() => setModalType("client")}>
            👤 Add Client
          </button>
          <button className="qa-btn qa-task" onClick={() => setModalType("task")}>
            ✅ Add Task
          </button>
        </div>
      </div>

      {/* Interactive Metric Cards */}
      <div className="stats">
        <div className="card clickable" onClick={() => navigate("/clients")}>
          <div className="card-top">
            <h3>👥 Total Clients</h3>
            <span className="card-icon">👥</span>
          </div>
          <p className="card-val">{clients.length}</p>
          <span className="card-foot">Click to view directory →</span>
        </div>

        <div className="card clickable" onClick={() => navigate("/leads")}>
          <div className="card-top">
            <h3>📈 Pipeline Leads</h3>
            <span className="card-icon">📈</span>
          </div>
          <p className="card-val">{totalLeads}</p>
          <span className="card-foot">{wonLeadsCount} won deals ({conversionRate}%)</span>
        </div>

        <div className="card clickable" onClick={() => navigate("/tasks")}>
          <div className="card-top">
            <h3>✅ Tasks Due Today</h3>
            <span className="card-icon">📅</span>
          </div>
          <p className="card-val">{dueToday.length}</p>
          <span className="card-foot">{completedTasks} of {tasks.length} tasks finished</span>
        </div>

        <div className="card highlight-card">
          <div className="card-top">
            <h3>🏆 Win Rate</h3>
            <span className="card-icon">🎯</span>
          </div>
          <p className="card-val">{conversionRate}%</p>
          <div className="mini-progress-bar">
            <div className="mini-progress-fill" style={{ width: `${conversionRate}%` }} />
          </div>
        </div>
      </div>

      {/* Charts & Visual Analytics Section */}
      <div className="dashboard-grid">
        {/* Pipeline Stage Visual Breakdown */}
        <div className="panel chart-panel">
          <div className="panel-header">
            <h3>🎯 Lead Pipeline Distribution</h3>
            <button className="view-link" onClick={() => navigate("/leads")}>Open Kanban Board →</button>
          </div>
          <div className="pipeline-bars">
            {Object.entries(stageCounts).map(([stage, count]) => {
              const percentage = totalLeads ? Math.round((count / totalLeads) * 100) : 0;
              return (
                <div
                  key={stage}
                  className="pipeline-stage-row"
                  onClick={() => navigate("/leads")}
                  title={`Click to view ${stage} leads`}
                >
                  <div className="stage-label-box">
                    <span className="dot" style={{ backgroundColor: stageColors[stage] }} />
                    <span className="stage-name">{stage}</span>
                    <span className="stage-count">({count})</span>
                  </div>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${Math.max(percentage, 6)}%`,
                        backgroundColor: stageColors[stage],
                      }}
                    >
                      {percentage > 0 && <span className="bar-text">{percentage}%</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Task Completion Gauge / Meter */}
        <div className="panel chart-panel">
          <div className="panel-header">
            <h3>⚡ Task Completion Meter</h3>
            <button className="view-link" onClick={() => navigate("/tasks")}>View All Tasks →</button>
          </div>
          <div className="task-meter-content">
            <div className="progress-ring-container">
              <div className="progress-value">{taskProgress}%</div>
              <div className="progress-subtext">Completed</div>
            </div>
            <div className="task-meter-stats">
              <div className="meter-stat">
                <span className="m-val">{completedTasks}</span>
                <span className="m-lbl">Done</span>
              </div>
              <div className="meter-stat">
                <span className="m-val">{tasks.length - completedTasks}</span>
                <span className="m-lbl">Pending</span>
              </div>
              <div className="meter-stat">
                <span className="m-val">{dueToday.length}</span>
                <span className="m-lbl">Due Today</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Feed & Upcoming Lists */}
      <div className="dashboard-grid">
        <div className="panel">
          <h3>⚡ Live Activity Stream</h3>
          {activities.length === 0 ? (
            <p className="empty">No recent activity.</p>
          ) : (
            <ul className="activity-list">
              {activities.slice(0, 5).map((act) => (
                <li key={act.id}>
                  <span className="act-bullet">•</span>
                  <div className="act-info">
                    <p className="act-text">{act.text}</p>
                    <span className="act-time">{act.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="panel">
          <h3>⏳ Priority Tasks</h3>
          {upcomingTasks.length === 0 ? (
            <p className="empty">No pending tasks!</p>
          ) : (
            <ul className="preview-list">
              {upcomingTasks.map((task) => (
                <li key={task.id} className="task-item-preview">
                  <div className="t-title">{task.title || task.text}</div>
                  <div className="t-meta">
                    {task.assignedTo && <span className="t-tag">{task.assignedTo}</span>}
                    <span className={`t-date ${task.dueDate === today ? "urgent" : ""}`}>
                      📅 {task.dueDate || "No Date"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Quick Action Modal Overlay */}
      {modalType && (
        <div className="modal-overlay" onClick={() => setModalType(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {modalType === "lead" && "➕ Create New Lead"}
                {modalType === "client" && "👤 Add New Client"}
                {modalType === "task" && "✅ Add New Task"}
              </h3>
              <button className="modal-close-btn" onClick={() => setModalType(null)}>✕</button>
            </div>

            {modalType === "lead" && (
              <form onSubmit={handleCreateLead} className="modal-form">
                <input
                  type="text"
                  placeholder="Lead Title (e.g. Website Redesign Proposal)"
                  value={leadForm.title}
                  onChange={(e) => setLeadForm({ ...leadForm, title: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Description / Requirements"
                  value={leadForm.description}
                  onChange={(e) => setLeadForm({ ...leadForm, description: e.target.value })}
                  rows="3"
                />
                <select
                  value={leadForm.clientId}
                  onChange={(e) => setLeadForm({ ...leadForm, clientId: e.target.value })}
                >
                  <option value="">Assign to Client (Optional)</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <select
                  value={leadForm.priority}
                  onChange={(e) => setLeadForm({ ...leadForm, priority: e.target.value })}
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </select>
                <div className="modal-actions">
                  <button type="button" onClick={() => setModalType(null)} className="btn-cancel">Cancel</button>
                  <button type="submit" className="btn-submit">Add Lead</button>
                </div>
              </form>
            )}

            {modalType === "client" && (
              <form onSubmit={handleCreateClient} className="modal-form">
                <input
                  type="text"
                  placeholder="Client Name"
                  value={clientForm.name}
                  onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={clientForm.email}
                  onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Tags (comma separated: VIP, Enterprise)"
                  value={clientForm.tags}
                  onChange={(e) => setClientForm({ ...clientForm, tags: e.target.value })}
                />
                <div className="modal-actions">
                  <button type="button" onClick={() => setModalType(null)} className="btn-cancel">Cancel</button>
                  <button type="submit" className="btn-submit">Save Client</button>
                </div>
              </form>
            )}

            {modalType === "task" && (
              <form onSubmit={handleCreateTask} className="modal-form">
                <input
                  type="text"
                  placeholder="Task Title"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Note / Details"
                  value={taskForm.note}
                  onChange={(e) => setTaskForm({ ...taskForm, note: e.target.value })}
                />
                <select
                  value={taskForm.assignedTo}
                  onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                >
                  <option value="">Assign To...</option>
                  {clients.map((c) => (
                    <option key={c.id} value={`Client: ${c.name}`}>Client: {c.name}</option>
                  ))}
                  {allLeads.map((l) => (
                    <option key={l.id} value={`Lead: ${l.title}`}>Lead: {l.title}</option>
                  ))}
                </select>
                <input
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                />
                <div className="modal-actions">
                  <button type="button" onClick={() => setModalType(null)} className="btn-cancel">Cancel</button>
                  <button type="submit" className="btn-submit">Add Task</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
