import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

function App() {
  const [data, setData] = useState({ inventory: [], auditLogs: [], metrics: {}, system: {} });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inventory');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_BASE}/all-data`);
      setData(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    alert("Terminating Session...");
    window.location.reload();
  };

  const exportPDF = () => alert("Generating PDF Report...");
  const sendMail = () => alert("Sending Data over Mail...");

  if (loading) return <div className="loader">OMNICYCLE_PRO_SYNCING...</div>;

  return (
    <div className="elite-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand-section">
          <h1 className="logo-text">OMNICYCLE PRO</h1>
        </div>
        
        <nav className="nav-menu">
          <button className={activeTab === 'inventory' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab('inventory')}>📦 Inventory</button>
          <button className={activeTab === 'reports' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab('reports')}>📊 Reports</button>
          <button className={activeTab === 'master' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab('master')}>📂 Master Data</button>
          <button className={activeTab === 'audit' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab('audit')}>📜 Audit Trail</button>
        </nav>

        <div className="user-profile">
          <p className="user-label">SUPER_ADMIN</p>
          <p className="user-name">Abhishek Singh</p>
          <button className="logout-btn" onClick={handleLogout}>Terminate Session</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-viewport">
        <header className="viewport-header">
          <h2>{activeTab.toUpperCase()} OVERVIEW</h2>
          <div className="header-actions">
            <button className="action-btn pdf" onClick={exportPDF}>📄 PDF</button>
            <button className="action-btn mail" onClick={sendMail}>📧 Mail</button>
            <span className="online-indicator">● ONLINE</span>
          </div>
        </header>

        <div className="content-container">
          {activeTab === 'inventory' && (
            <div className="data-card">
              <div className="card-header">
                <h3>Inventory Master Data</h3>
                <button className="add-btn">+ Add New Item</button>
              </div>
              <table>
                <thead>
                  <tr><th>REF_ID</th><th>ITEM NAME</th><th>CATEGORY</th><th>QTY</th><th>STATUS</th><th>ACTIONS</th></tr>
                </thead>
                <tbody>
                  {data.inventory.map(item => (
                    <tr key={item.id}>
                      <td>{item.id}</td><td>{item.name}</td><td>{item.category}</td><td>{item.stock}</td>
                      <td><span className={`badge ${item.status.toLowerCase()}`}>{item.status}</span></td>
                      <td><button className="delete-icon">🗑️</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="stats-grid">
              <div className="stat-card"><h4>EFFICIENCY</h4><p>97.2%</p></div>
              <div className="stat-card"><h4>ACTIVE NODES</h4><p>12</p></div>
              <div className="stat-card"><h4>WAREHOUSE CAPACITY</h4><p>82%</p></div>
            </div>
          )}

          {activeTab === 'master' && (
            <div className="stats-grid">
              <div className="stat-card"><h4>WAREHOUSES</h4><p>4</p></div>
              <div className="stat-card"><h4>ACTIVE STAFF</h4><p>32</p></div>
              <div className="stat-card"><h4>UPTIME</h4><p>99.9%</p></div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="data-card">
              <table>
                <thead>
                  <tr><th>LOG_ID</th><th>EVENT</th><th>OPERATOR</th><th>TIMESTAMP</th></tr>
                </thead>
                <tbody>
                  {data.auditLogs.map(log => (
                    <tr key={log.id}>
                      <td>{log.id}</td><td>{log.event}</td><td>{log.operator}</td><td>{new Date(log.time).toLocaleString()}</td>
                    </tr>
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