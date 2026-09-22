import { useState, useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { CRMContext } from "../context/CRMContext";
import CommandPalette from "./CommandPalette";
import Toast from "./Toast";
import logo from "../assets/logo.png";
import "./Layout.css";

export default function Layout() {
  const [cmdOpen, setCmdOpen] = useState(false);
  const { toastMessage, clearToast, resetDemoData, clients, leads, tasks } = useContext(CRMContext);

  const totalLeads = Object.values(leads || {}).flat().length;
  const pendingTasks = tasks.filter((t) => !t.done).length;

  return (
    <div className="layout">
      <header className="header">
        <div className="header-brand">
          {logo && <img src={logo} alt="Mini Fluxxion Logo" className="logo" />}
          <h1>Fluxxion Mini CRM</h1>
        </div>

        <div className="header-actions">
          <button
            className="cmd-trigger-btn"
            onClick={() => setCmdOpen(true)}
            title="Search CRM (Ctrl+K)"
          >
            <span>🔍 Search...</span>
            <kbd>Ctrl K</kbd>
          </button>

          <button
            className="reset-demo-btn"
            onClick={resetDemoData}
            title="Reset to sample dataset"
          >
            🔄 Reset Demo Data
          </button>
        </div>
      </header>

      <div className="body">
        <nav className="sidebar">
          <ul>
            <li>
              <NavLink to="/" end className={({ isActive }) => (isActive ? "nav active" : "nav")}>
                <span>📊</span> Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/clients" className={({ isActive }) => (isActive ? "nav active" : "nav")}>
                <span>👥</span> Clients
                <span className="badge">{clients.length}</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/leads" className={({ isActive }) => (isActive ? "nav active" : "nav")}>
                <span>📈</span> Leads
                <span className="badge badge-teal">{totalLeads}</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/tasks" className={({ isActive }) => (isActive ? "nav active" : "nav")}>
                <span>✅</span> Tasks
                {pendingTasks > 0 && <span className="badge badge-warning">{pendingTasks}</span>}
              </NavLink>
            </li>
          </ul>
        </nav>

        <main className="main">
          <Outlet />
        </main>
      </div>

      <CommandPalette isOpen={cmdOpen} onClose={setCmdOpen} />
      <Toast toast={toastMessage} onClose={clearToast} />
    </div>
  );
}
