import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = "https://omnicycle-pro.onrender.com";

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('auth_session')));
  const [tab, setTab] = useState('inventory');
  const [data, setData] = useState({ inventory: [], auditLogs: [], metrics: {} });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchSystemData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/all-data`);
        setData(res.data);
      } catch (err) {
        console.error("API Connection Error");
      }
      setLoading(false);
    };
    fetchSystemData();
  }, [user, tab]);

  if (!user) return (
    <div className="login-screen">
      <div className="login-box">
        <h2 style={{color: '#a18e0d', letterSpacing: '4px'}}>OMNICYCLE</h2>
        <p style={{fontSize: '10px', color: '#444', marginBottom: '25px'}}>ADMIN TERMINAL V4.0</p>
        <form onSubmit={(e) => { e.preventDefault(); const u={name: "Abhishek Singh"}; localStorage.setItem('auth_session', JSON.stringify(u)); setUser(u); }}>
          <input className="login-input" type="email" placeholder="Terminal ID" required />
          <input className="login-input" type="password" placeholder="Access Password" required />
          <button type="submit" className="login-btn">INITIALIZE SESSION</button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h3 style={{color: '#a18e0d', marginBottom: '40px'}}>OMNICYCLE PRO</h3>
        <nav style={{flex: 1}}>
          <button className={`nav-link ${tab === 'inventory' ? 'active' : ''}`} onClick={() => setTab('inventory')}>📦 Inventory</button>
          <button className={`nav-link ${tab === 'reports' ? 'active' : ''}`} onClick={() => setTab('reports')}>📊 Reports</button>
          <button className={`nav-link ${tab === 'master' ? 'active' : ''}`} onClick={() => setTab('master')}>📁 Master Data</button>
          <button className={`nav-link ${tab === 'audit' ? 'active' : ''}`} onClick={() => setTab('audit')}>📜 Audit Trail</button>
        </nav>
        <div style={{borderTop: '1px solid #111', paddingTop: '20px'}}>
          <p style={{fontSize: '11px', color: '#555', margin: 0}}>SUPER_ADMIN</p>
          <p style={{fontWeight: 'bold', margin: '5px 0 15px 0'}}>{user.name}</p>
          <button onClick={() => {localStorage.clear(); window.location.reload();}} style={{color: '#ff4d4d', background: 'none', border: 'none', cursor: 'pointer', padding: 0}}>Terminate</button>
        </div>
      </aside>

      <main className="main-view">
        <header className="header">
          <h2 style={{margin: 0}}>{tab.toUpperCase()}</h2>
          <div style={{display: 'flex', gap: '10px'}}>
            <button className="nav-link" style={{border: '1px solid #222', width: 'auto', padding: '8px 15px'}}>📄 PDF</button>
            <button className="nav-link" style={{border: '1px solid #222', width: 'auto', padding: '8px 15px'}}>📧 Mail</button>
            <span style={{color: loading ? '#f1c40f' : '#2ecc71', fontSize: '10px', marginLeft: '10px'}}>● {loading ? 'SYNCING' : 'LIVE'}</span>
          </div>
        </header>

        <div className="table-container">
          {tab === 'inventory' && (
            <table className="data-table">
              <thead><tr><th>ID</th><th>ITEM</th><th>CATEGORY</th><th>STOCK</th><th>STATUS</th></tr></thead>
              <tbody>
                {data.inventory.map((item, i) => (
                  <tr key={i}><td>{item.id}</td><td>{item.name}</td><td>{item.category}</td><td style={{color: '#fff', fontWeight: 'bold'}}>{item.stock}</td><td>{item.status}</td></tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === 'reports' && (
            <div className="stats-grid" style={{padding: 0}}>
              <div className="stat-card"><h4>Efficiency</h4><p>{data.metrics?.efficiency || '98.4%'}</p></div>
              <div className="stat-card"><h4>Total Stocks</h4><p>215</p></div>
              <div className="stat-card"><h4>Health</h4><p style={{color: '#2ecc71'}}>Optimum</p></div>
            </div>
          )}

          {tab === 'master' && (
            <div className="stats-grid" style={{padding: 0}}>
              <div className="stat-card"><h4>Warehouses</h4><p>{data.metrics?.warehouses || 4}</p></div>
              <div className="stat-card"><h4>Nodes</h4><p>{data.metrics?.nodes || 12}</p></div>
              <div className="stat-card"><h4>Uptime</h4><p>{data.metrics?.uptime || '99.9%'}</p></div>
            </div>
          )}

          {tab === 'audit' && (
            <table className="data-table">
              <thead><tr><th>LOG ID</th><th>EVENT</th><th>OPERATOR</th><th>TIME</th></tr></thead>
              <tbody>
                {data.auditLogs.map((log, i) => (
                  <tr key={i}><td>{log.id}</td><td>{log.event}</td><td>{log.user}</td><td>{new Date(log.timestamp).toLocaleTimeString()}</td></tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;