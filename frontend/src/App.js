import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Vercel ke dashboard wala environment variable yahan use ho raha hai
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

function App() {
  const [data, setData] = useState({ 
    inventory: [], 
    auditLogs: [], 
    metrics: {}, 
    system: {} 
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inventory');

  useEffect(() => {
    // Gateway se data fetch karne ka logic
    const fetchAllData = async () => {
      try {
        const response = await axios.get(`${API_BASE}/all-data`);
        setData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Gateway Sync Error:", err);
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) return <div className="loader">SYNCING WITH INDUSTRIAL GATEWAY...</div>;

  return (
    <div className="app-container">
      {/* Sidebar for Navigation */}
      <nav className="sidebar">
        <div className="brand">OMNICYCLE PRO</div>
        <button className={activeTab === 'inventory' ? 'active' : ''} onClick={() => setActiveTab('inventory')}>📦 Inventory</button>
        <button className={activeTab === 'audit' ? 'active' : ''} onClick={() => setActiveTab('audit')}>📜 Audit Trail</button>
        <button className={activeTab === 'system' ? 'active' : ''} onClick={() => setActiveTab('system')}>⚙️ System Health</button>
      </nav>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="content-header">
          <h2>{activeTab.toUpperCase()} PANEL</h2>
          <div className="user-badge">SUPER_ADMIN: ABHISHEK SINGH</div>
        </header>

        <div className="data-display">
          {activeTab === 'inventory' && (
            <div className="table-wrapper">
              <h3>Inventory Master Data</h3>
              <table>
                <thead>
                  <tr>
                    <th>REF_ID</th>
                    <th>ITEM NAME</th>
                    <th>CATEGORY</th>
                    <th>QUANTITY</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {data.inventory.length > 0 ? data.inventory.map(item => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td>{item.stock}</td>
                      <td className={`status-${item.status.toLowerCase()}`}>{item.status}</td>
                    </tr>
                  )) : <tr><td colSpan="5">No Inventory Data Found</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="table-wrapper">
              <h3>System Activity Logs</h3>
              <table>
                <thead>
                  <tr>
                    <th>LOG_ID</th>
                    <th>EVENT DESCRIPTION</th>
                    <th>OPERATOR</th>
                    <th>TIMESTAMP</th>
                  </tr>
                </thead>
                <tbody>
                  {data.auditLogs.length > 0 ? data.auditLogs.map(log => (
                    <tr key={log.id}>
                      <td>{log.id}</td>
                      <td>{log.event}</td>
                      <td>{log.operator}</td>
                      <td>{new Date(log.time).toLocaleString()}</td>
                    </tr>
                  )) : <tr><td colSpan="4">No Audit Logs Found</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="system-grid">
              <div className="metric-card">
                <h4>System Status</h4>
                <p>{data.system.status || "Checking..."}</p>
              </div>
              <div className="metric-card">
                <h4>Uptime</h4>
                <p>{data.metrics.uptime || "99.9%"}</p>
              </div>
              <div className="metric-card">
                <h4>DB Connection</h4>
                <p>{data.system.database || "Connected"}</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;