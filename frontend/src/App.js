import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

function App() {
  const [data, setData] = useState({ inventory: [], auditLogs: [], metrics: {}, system: {} });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inventory');
  // LocalStorage se login state check karna
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
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

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // Session terminate logic
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    alert("Session Terminated Safely.");
  };

  // Login Page View
  if (!isLoggedIn) {
    return (
      <div className="login-screen">
        <div className="login-glass-card">
          <h1 className="logo-text">OMNICYCLE PRO</h1>
          <p className="subtitle">INDUSTRIAL INTELLIGENCE GATEWAY</p>
          <form onSubmit={handleLogin}>
            <input type="text" placeholder="ADMIN_ACCESS_KEY" required />
            <input type="password" placeholder="SECURE_PHRASE" required />
            <button type="submit" className="login-btn">INITIALIZE SYSTEM</button>
          </form>
          <div className="system-status">● CORE_ENGINE: READY</div>
        </div>
      </div>
    );
  }

  if (loading) return <div className="loader">SYNCING_WITH_NODES...</div>;

  return (
    <div className="elite-viewport">
      <aside className="glass-sidebar">
        <div className="brand-header">
          <h1 className="logo-text">OMNICYCLE PRO</h1>
        </div>
        
        <nav className="side-nav">
          <button className={activeTab === 'inventory' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveTab('inventory')}>📦 INVENTORY</button>
          <button className={activeTab === 'reports' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveTab('reports')}>📈 REPORTS</button>
          <button className={activeTab === 'master' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveTab('master')}>📂 MASTER DATA</button>
          <button className={activeTab === 'audit' ? 'nav-link active' : 'nav-link'} onClick={() => setActiveTab('audit')}>📜 AUDIT TRAIL</button>
        </nav>

        <div className="admin-footer">
          <div className="user-info">
            <span className="rank">SUPER_ADMIN</span>
            <span className="name">Abhishek Singh</span>
          </div>
          <button className="terminate-btn" onClick={handleLogout}>TERMINATE SESSION</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <h2>{activeTab.toUpperCase()} OVERVIEW</h2>
          <div className="utility-bar">
            <button className="util-btn">📄 PDF</button>
            <button className="util-btn">📧 MAIL</button>
            <div className="live-status">● LIVE_FEED</div>
          </div>
        </header>

        <div className="data-display-area">
          {activeTab === 'inventory' && (
            <div className="glass-card table-view">
              <div className="card-top">
                <h3>Global Asset Tracker</h3>
                <button className="add-item-btn">+ NEW ASSET</button>
              </div>
              <table>
                <thead>
                  <tr><th>REF_ID</th><th>ITEM NAME</th><th>CATEGORY</th><th>QTY</th><th>STATUS</th><th>ACTIONS</th></tr>
                </thead>
                <tbody>
                  {data.inventory.map(item => (
                    <tr key={item.id}>
                      <td>{item.id}</td><td>{item.name}</td><td>{item.category}</td><td>{item.stock}</td>
                      <td><span className={`status-pill ${item.status.toLowerCase()}`}>{item.status}</span></td>
                      <td><button className="row-action">🗑️</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* Baaki Tabs ka logic yahan aayega */}
        </div>
      </main>
    </div>
  );
}

export default App;