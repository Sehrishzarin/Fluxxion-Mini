import { Link, Outlet } from "react-router-dom";
import "./Layout.css";
import logo from "../assets/logo.png";

import { NavLink } from "react-router-dom";

export default function Layout() {
  return (
    <div className="layout">
    <header className="header">
  <img src={logo} alt="Mini Fluxxion Logo" className="logo" />
  <h1>Fluxxion mini</h1>
</header>
      
      <div className="body">
        <nav className="sidebar">
          <ul>     
<li><NavLink to="/" end className="nav">📊 Dashboard</NavLink></li>
<li><NavLink to="/clients" className="nav">👥 Clients</NavLink></li>
<li><NavLink to="/leads" className="nav">📈 Leads</NavLink></li>
<li><NavLink to="/tasks" className="nav">✅ Tasks</NavLink></li>
          </ul>
        </nav>

        <main className="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
