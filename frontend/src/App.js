import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// RENDER URL (Confirm this is correct in your Render Dashboard)
const API_URL = "https://omnicycle-pro.onrender.com";

function App() {
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem('icms_auth')));
  const [activeTab, setActiveTab] = useState('inventory');
  const [db, setDb] = useState({ inventory: [], auditLogs: [], metrics: {} });
  const [isSyncing, setIsSyncing] = useState(false);

  // Data Fetching Logic
  useEffect(() => {
    if (!auth) return;
    const fetchData = async () => {
      setIsSyncing(true);
      try {
        const res = await axios.get(`${API_URL}/all-data`);
        setDb(res.data);
      } catch (err) {
        console.error("System offline or 404. Check Render URL.");
      }
      setIsSyncing(false);
    };
    fetchData();
  }, [auth, activeTab]);

  const handleLogin = (e) => {
    e.preventDefault();
    const user = { name: "Abhishek Singh", role: "MASTER_ADMIN" };
    localStorage.setItem('icms_auth', JSON.stringify(user));
    setAuth(user);
  };

  if (!auth) return (
    <div className="login-overlay">
      <div className="login-panel">
        <h2 className="gold-title">OMNICYCLE</h2>
        <p className="sub-title">INDUSTRIAL CMS PRO V6.0</p>
        <form onSubmit={handleLogin}>
          <input className="input-field" type="email" placeholder="Terminal ID" required />
          <input className="input-field" type="password" placeholder="Access Code" required />
          <button type="submit" className="primary-btn">INITIALIZE SYSTEM</button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="shell">
      <aside className="sidebar">
        <h3 className="gold-text">OMNICYCLE PRO</h3>
        <nav className="menu">
          <button className={`menu-btn ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>📦 Inventory</button>
          <button className={`menu-btn ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>📊 Reports</button>
          <button className={`menu-btn ${activeTab === 'master' ? 'active' : ''}`} onClick={() => setActiveTab('master')}>📁 Master Data</button>
          <button className={`menu-btn ${activeTab === 'audit' ? 'active' : ''}`} onClick={() => setActiveTab('audit')}>📜 Audit Trail</button>
        </nav>
        <div className="footer-profile">
          <p className="tag">SUPER_ADMIN</p>
          <p className="name">{auth.name}</p>
          <button className="logout-link" onClick={() => {localStorage.clear(); window.location.reload();}}>Terminate Session</button>
        </div>
      </aside>

      <main className="content-area">
        <header className="top-bar">
          <h2>{activeTab.toUpperCase()}</h2>
          <div className="actions">
            <button className="btn-outline">📄 PDF</button>
            <button className="btn-outline">📧 Mail</button>
            <span className={`status ${isSyncing ? 'sync' : 'online'}`}>● {isSyncing ? 'SYNCING' : 'ONLINE'}</span>
          </div>
        </header>

        <div className="workspace">
          {activeTab === 'inventory' && (
            <div className="table-container">
              <table className="main-table">
                <thead><tr><th>REF_ID</th><th>ITEM</th><th>CATEGORY</th><th>QTY</th><th>STATUS</th></tr></thead>
                <tbody>
                  {db.inventory?.map((item, i) => (
                    <tr key={i}><td>{item.id}</td><td>{item.name}</td><td>{item.category}</td><td>{item.stock}</td><td>{item.status}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="metrics-grid">
              <div className="card"><h4>Efficiency</h4><p>{db.metrics?.efficiency || '97.2%'}</p></div>
              <div className="card"><h4>Active Nodes</h4><p>{db.metrics?.nodes || 12}</p></div>
              <div className="card"><h4>Warehouse Capacity</h4><p>82%</p></div>
            </div>
          )}

          {activeTab === 'master' && (
            <div className="metrics-grid">
              <div className="card"><h4>Warehouses</h4><p>{db.metrics?.warehouses || 4}</p></div>
              <div className="card"><h4>Active Staff</h4><p>{db.metrics?.activeStaff || 32}</p></div>
              <div className="card"><h4>Uptime</h4><p>{db.metrics?.uptime || '99.9%'}</p></div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="table-container">
              <table className="main-table">
                <thead><tr><th>LOG_ID</th><th>EVENT</th><th>OPERATOR</th><th>TIMESTAMP</th></tr></thead>
                <tbody>
                  {db.auditLogs?.map((log, i) => (
                    <tr key={i}><td>{log.id}</td><td>{log.event}</td><td>{log.operator}</td><td>{new Date(log.time).toLocaleTimeString()}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;