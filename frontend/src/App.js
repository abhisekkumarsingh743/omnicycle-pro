import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

function App() {
  const [data, setData] = useState({ inventory: [], auditLogs: [], metrics: {}, system: {} });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inventory');
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

  useEffect(() => {
    if (isLoggedIn) fetchData();
  }, [isLoggedIn]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_BASE}/all-data`);
      setData(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Gateway Sync Error:", err);
      setLoading(false);
    }
  };

  // --- Handlers ---
  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  const addItem = () => {
    const newItem = { id: `IND-${Math.floor(Math.random() * 900 + 100)}`, name: "New Asset Node", category: "General", stock: 0, status: "Active" };
    setData({ ...data, inventory: [newItem, ...data.inventory] });
  };

  const deleteItem = (id) => {
    setData({ ...data, inventory: data.inventory.filter(item => item.id !== id) });
  };

  // --- Views ---
  if (!isLoggedIn) return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="glitch-text">OMNICYCLE_PRO</h1>
        <p>INDUSTRIAL_ACCESS_REQUIRED</p>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="IDENTITY_KEY" required />
          <input type="password" placeholder="SECURITY_HASH" required />
          <button type="submit" className="glow-btn">INITIALIZE</button>
        </form>
      </div>
    </div>
  );

  if (loading) return <div className="loader">DECRYPTING_SYSTEM_NODES...</div>;

  return (
    <div className="dashboard-root">
      <aside className="elite-sidebar">
        <div className="sidebar-brand">OMNICYCLE</div>
        <nav className="nav-group">
          <button className={activeTab === 'inventory' ? 'nav-tab active' : 'nav-tab'} onClick={() => setActiveTab('inventory')}>📦 INVENTORY</button>
          <button className={activeTab === 'reports' ? 'nav-tab active' : 'nav-tab'} onClick={() => setActiveTab('reports')}>📈 REPORTS</button>
          <button className={activeTab === 'audit' ? 'nav-tab active' : 'nav-tab'} onClick={() => setActiveTab('audit')}>📜 AUDIT</button>
        </nav>
        <div className="user-section">
          <div className="status-dot"></div>
          <p>ABHISHEK SINGH</p>
          <button className="term-btn" onClick={handleLogout}>TERMINATE</button>
        </div>
      </aside>

      <main className="main-viewport">
        <header className="viewport-nav">
          <h2>{activeTab.toUpperCase()} _PANEL</h2>
          <div className="action-row">
            <button className="glass-btn">📄 PDF</button>
            <button className="glass-btn">📧 MAIL</button>
          </div>
        </header>

        <div className="content-scroll">
          {activeTab === 'inventory' && (
            <div className="glass-table-card">
              <div className="table-header">
                <h3>Global Inventory Sync</h3>
                <button className="add-node-btn" onClick={addItem}>+ ADD_NODE</button>
              </div>
              <table>
                <thead>
                  <tr><th>REF_ID</th><th>ASSET_NAME</th><th>CAT</th><th>QTY</th><th>STATUS</th><th>OP</th></tr>
                </thead>
                <tbody>
                  {data.inventory.map(item => (
                    <tr key={item.id}>
                      <td>{item.id}</td><td>{item.name}</td><td>{item.category}</td><td>{item.stock}</td>
                      <td><span className={`pill ${item.status.toLowerCase()}`}>{item.status}</span></td>
                      <td><button onClick={() => deleteItem(item.id)} className="del-btn">🗑️</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="grid-container">
              <div className="stat-card"><h4>EFFICIENCY</h4><p>{data.metrics.efficiency || '98.4%'}</p></div>
              <div className="stat-card"><h4>ACTIVE_NODES</h4><p>{data.metrics.nodes || '12'}</p></div>
              <div className="stat-card"><h4>UPTIME</h4><p>{data.metrics.uptime || '99.9%'}</p></div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="glass-table-card">
              <table>
                <thead>
                  <tr><th>LOG_ID</th><th>EVENT</th><th>OPERATOR</th><th>TS</th></tr>
                </thead>
                <tbody>
                  {data.auditLogs.map(log => (
                    <tr key={log.id}>
                      <td>{log.id}</td><td>{log.event}</td><td>{log.operator}</td><td>{new Date(log.time).toLocaleTimeString()}</td>
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