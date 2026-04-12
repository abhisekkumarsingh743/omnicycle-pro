import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

function App() {
  const [data, setData] = useState({ inventory: [], metrics: {}, auditLogs: [] });
  const [activeTab, setActiveTab] = useState('inventory');
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', category: '', stock: '', status: 'Active' });

  useEffect(() => { if (isLoggedIn) fetchData(); }, [isLoggedIn]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_BASE}/all-data`);
      setData(res.data);
    } catch (err) { console.error("Fetch error"); }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  const addItem = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/add-item`, newItem);
      setShowAddForm(false);
      fetchData();
    } catch (e) { alert("Add failed"); }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`${API_BASE}/delete-item/${id}`);
      fetchData();
    } catch (e) { alert("Delete failed"); }
  };

  if (!isLoggedIn) return (
    <div className="login-wrapper">
      <div className="login-glass-card">
        <div className="login-header">
          <h1>OMNICYCLE PRO</h1>
          <p>SYSTEM ACCESS REQUIRED</p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>IDENTITY_KEY</label>
            <input type="text" placeholder="ADMIN_743" required />
          </div>
          <div className="input-group">
            <label>SECURE_HASH</label>
            <input type="password" placeholder="••••••••" required />
          </div>
          <button type="submit" className="login-submit">INITIALIZE COMMAND CENTER</button>
        </form>
        <div className="login-footer">● STATUS: ENCRYPTED_CONNECTION_READY</div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-root">
      <aside className="vertical-nav">
        <div className="brand-zone">
          <h1 className="nav-logo">OMNICYCLE</h1>
          <span className="version">v2.0.4</span>
        </div>
        
        <div className="nav-links">
          <button className={activeTab === 'inventory' ? 'n-btn active' : 'n-btn'} onClick={() => setActiveTab('inventory')}>📦 INVENTORY</button>
          <button className={activeTab === 'reports' ? 'n-btn active' : 'n-btn'} onClick={() => setActiveTab('reports')}>📊 ANALYTICS</button>
          <button className={activeTab === 'master' ? 'n-btn active' : 'n-btn'} onClick={() => setActiveTab('master')}>📂 MASTER DATA</button>
          <button className={activeTab === 'audit' ? 'n-btn active' : 'n-btn'} onClick={() => setActiveTab('audit')}>📜 AUDIT TRAIL</button>
        </div>

        <div className="nav-user">
          <div className="user-pill">
            <p className="u-name">ABHISHEK SINGH</p>
            <p className="u-status">ADMINISTRATOR</p>
          </div>
          <button className="logout-action" onClick={() => { localStorage.clear(); setIsLoggedIn(false); }}>TERMINATE SESSION</button>
        </div>
      </aside>

      <main className="main-viewport">
        <header className="viewport-header">
          <h2>{activeTab.replace('_', ' ').toUpperCase()}</h2>
          <div className="header-actions">
            <button className="util-btn" onClick={() => alert("PDF Generated")}>📄 PDF</button>
            <button className="util-btn" onClick={() => alert("Email Sent")}>📧 MAIL</button>
            <span className="live-pulse">● LIVE</span>
          </div>
        </header>

        {showAddForm && (
          <div className="modal-bg">
            <form className="add-form-card" onSubmit={addItem}>
              <h3>REGISTER ASSET</h3>
              <input placeholder="Asset Name" onChange={e => setNewItem({...newItem, name: e.target.value})} required />
              <input placeholder="Category" onChange={e => setNewItem({...newItem, category: e.target.value})} required />
              <input type="number" placeholder="Quantity" onChange={e => setNewItem({...newItem, stock: e.target.value})} required />
              <div className="modal-actions">
                <button type="submit" className="save-btn">CONFIRM</button>
                <button type="button" className="close-btn" onClick={() => setShowAddForm(false)}>CANCEL</button>
              </div>
            </form>
          </div>
        )}

        <div className="scroll-content">
          {activeTab === 'inventory' && (
            <div className="table-wrapper">
              <div className="table-top">
                <h3>Asset Inventory</h3>
                <button className="prime-btn" onClick={() => setShowAddForm(true)}>+ ADD NODE</button>
              </div>
              <table>
                <thead>
                  <tr><th>REF_ID</th><th>NAME</th><th>CAT</th><th>QTY</th><th>STATUS</th><th>OP</th></tr>
                </thead>
                <tbody>
                  {data.inventory.map(item => (
                    <tr key={item.id}>
                      <td className="mono">{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td>{item.stock}</td>
                      <td><span className={`badge ${item.status.toLowerCase()}`}>{item.status}</span></td>
                      <td><button onClick={() => deleteItem(item.id)} className="trash-btn">🗑️</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {(activeTab === 'reports' || activeTab === 'master') && (
            <div className="table-wrapper">
              <h3>System Operational Metrics</h3>
              <table>
                <thead>
                  <tr><th>METRIC</th><th>VALUE</th><th>THRESHOLD</th><th>STATUS</th></tr>
                </thead>
                <tbody>
                  <tr><td>System Efficiency</td><td>{data.metrics.efficiency || "98.4%"}</td><td>95%</td><td className="green">OPTIMAL</td></tr>
                  <tr><td>Active Nodes</td><td>{data.metrics.nodes || "14"}</td><td>10</td><td className="green">ONLINE</td></tr>
                  <tr><td>System Uptime</td><td>{data.metrics.uptime || "99.9%"}</td><td>99%</td><td className="green">STABLE</td></tr>
                  <tr><td>Database Latency</td><td>12ms</td><td>50ms</td><td className="green">GOOD</td></tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="table-wrapper">
              <h3>Security Audit Trail</h3>
              <table>
                <thead>
                  <tr><th>LOG_ID</th><th>EVENT</th><th>OPERATOR</th><th>TIMESTAMP</th></tr>
                </thead>
                <tbody>
                  {data.auditLogs.map(log => (
                    <tr key={log.id}>
                      <td className="mono">{log.id}</td>
                      <td>{log.event}</td>
                      <td>{log.operator}</td>
                      <td>{new Date(log.time).toLocaleString()}</td>
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