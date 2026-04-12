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
    await axios.post(`${API_BASE}/add-item`, newItem);
    setShowAddForm(false);
    fetchData();
  };

  const deleteItem = async (id) => {
    await axios.delete(`${API_BASE}/delete-item/${id}`);
    fetchData();
  };

  if (!isLoggedIn) return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleLogin}>
        <h1>OMNICYCLE</h1>
        <input type="text" placeholder="ADMIN_ID" required />
        <input type="password" placeholder="ACCESS_TOKEN" required />
        <button type="submit">INITIALIZE SYSTEM</button>
        <p>ROLE: <span>ADMIN_PRIVILEGE</span></p>
      </form>
    </div>
  );

  return (
    <div className="dashboard-layout">
      <aside className="vertical-sidebar">
        <div className="brand">OMNICYCLE</div>
        <nav>
          <button className={activeTab === 'inventory' ? 'active' : ''} onClick={() => setActiveTab('inventory')}>📦 INVENTORY</button>
          <button className={activeTab === 'reports' ? 'active' : ''} onClick={() => setActiveTab('reports')}>📊 REPORTS</button>
          <button className={activeTab === 'master' ? 'active' : ''} onClick={() => setActiveTab('master')}>📂 MASTER DATA</button>
        </nav>
        <div className="user-info">
          <p>LOGGED IN AS:</p>
          <p className="user-name">ABHISHEK SINGH (ADMIN)</p>
          <button className="logout-btn" onClick={() => { localStorage.clear(); setIsLoggedIn(false); }}>TERMINATE</button>
        </div>
      </aside>

      <main className="content-area">
        <header>
          <h2>{activeTab.toUpperCase()} PANEL</h2>
          {(activeTab === 'reports' || activeTab === 'master') && (
            <div className="header-actions">
              <button onClick={() => alert("PDF Exporting...")}>📄 PDF</button>
              <button onClick={() => alert("Mail Sending...")}>📧 MAIL</button>
            </div>
          )}
        </header>

        {showAddForm && (
          <div className="modal">
            <form onSubmit={addItem} className="add-form">
              <h3>REGISTER NEW ASSET</h3>
              <input placeholder="Name" onChange={e => setNewItem({...newItem, name: e.target.value})} required />
              <input placeholder="Category" onChange={e => setNewItem({...newItem, category: e.target.value})} required />
              <input type="number" placeholder="Stock" onChange={e => setNewItem({...newItem, stock: e.target.value})} required />
              <button type="submit" className="confirm-btn">ADD TO BACKEND</button>
              <button type="button" onClick={() => setShowAddForm(false)}>CANCEL</button>
            </form>
          </div>
        )}

        <div className="view-container">
          {activeTab === 'inventory' && (
            <div className="table-card">
              <button className="add-node-btn" onClick={() => setShowAddForm(true)}>+ ADD NODE</button>
              <table>
                <thead><tr><th>REF_ID</th><th>NAME</th><th>QTY</th><th>STATUS</th><th>OP</th></tr></thead>
                <tbody>
                  {data.inventory.map(item => (
                    <tr key={item.id}>
                      <td>{item.id}</td><td>{item.name}</td><td>{item.stock}</td>
                      <td><span className="status-badge">{item.status}</span></td>
                      <td><button onClick={() => deleteItem(item.id)}>🗑️</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="stats-grid">
              <div className="stat-box"><h4>EFFICIENCY</h4><p>{data.metrics.efficiency}</p></div>
              <div className="stat-box"><h4>UPTIME</h4><p>{data.metrics.uptime}</p></div>
              <div className="stat-box"><h4>NODES</h4><p>{data.metrics.nodes}</p></div>
            </div>
          )}

          {activeTab === 'master' && (
            <div className="table-card">
              <h3>SYSTEM MASTER LOGS</h3>
              {data.auditLogs.map(log => <p key={log.id}>{log.event} by {log.operator}</p>)}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;