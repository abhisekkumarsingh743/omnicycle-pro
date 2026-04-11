import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API = "https://omnicycle-pro.onrender.com";

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('icms_user')));
  const [tab, setTab] = useState('inventory');
  const [data, setData] = useState({ inventory: [], auditLogs: [], metrics: {} });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const sync = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/all-data`);
        setData(res.data);
      } catch (e) { console.error("Sync Failed"); }
      setLoading(false);
    };
    sync();
  }, [user, tab]);

  if (!user) return (
    <div className="login-screen">
      <div className="login-box">
        <h2 style={{color: '#a18e0d', letterSpacing: '3px'}}>OMNICYCLE</h2>
        <p style={{fontSize: '10px', color: '#444', marginBottom: '25px'}}>INDUSTRIAL TERMINAL V3</p>
        <form onSubmit={(e) => { e.preventDefault(); const u={name:"Abhishek Singh"}; localStorage.setItem('icms_user', JSON.stringify(u)); setUser(u); }}>
          <input className="login-input" type="email" placeholder="Terminal ID" required />
          <input className="login-input" type="password" placeholder="Access Code" required />
          <button type="submit" className="btn-gold" style={{width:'100%'}}>INITIALIZE SESSION</button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h3 style={{color: '#a18e0d', marginBottom: '40px'}}>OMNICYCLE PRO</h3>
        <nav style={{flex: 1}}>
          <button className={`nav-item ${tab === 'inventory' ? 'active' : ''}`} onClick={() => setTab('inventory')}>📦 Inventory</button>
          <button className={`nav-item ${tab === 'reports' ? 'active' : ''}`} onClick={() => setTab('reports')}>📊 Reports</button>
          <button className={`nav-item ${tab === 'master' ? 'active' : ''}`} onClick={() => setTab('master')}>📁 Master Data</button>
          <button className={`nav-item ${tab === 'audit' ? 'active' : ''}`} onClick={() => setTab('audit')}>📜 Audit Trail</button>
        </nav>
        <div style={{borderTop: '1px solid #111', paddingTop: '20px'}}>
          <p style={{fontSize: '11px', color: '#555', margin: 0}}>ADMIN_PRO</p>
          <p style={{fontWeight: 'bold', margin: '5px 0 15px 0'}}>{user.name}</p>
          <button onClick={() => {localStorage.clear(); window.location.reload();}} style={{color: '#ff4d4d', background: 'none', border: 'none', cursor: 'pointer', padding: 0}}>Terminate</button>
        </div>
      </aside>

      <main className="main-stage">
        <header className="header">
          <h2 style={{margin: 0, textTransform: 'uppercase'}}>{tab}</h2>
          <div>
            <button className="btn-outline">📄 Export PDF</button>
            <button className="btn-outline">📧 Send Mail</button>
            <span style={{color: loading ? '#f1c40f' : '#2ecc71', fontSize: '10px', marginLeft: '15px'}}>● {loading ? 'SYNCING' : 'LIVE'}</span>
          </div>
        </header>

        <div className="viewport">
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
            <div className="grid-3">
              <div className="m-card"><h4>System Efficiency</h4><p>98.4%</p></div>
              <div className="m-card"><h4>Active Nodes</h4><p>{data.metrics?.nodes || 12}</p></div>
              <div className="m-card"><h4>Total Stocks</h4><p>175</p></div>
            </div>
          )}

          {tab === 'master' && (
            <div className="grid-3">
              <div className="m-card"><h4>Warehouses</h4><p>{data.metrics?.warehouses || 4}</p></div>
              <div className="m-card"><h4>Uptime</h4><p>{data.metrics?.uptime || '99.9%'}</p></div>
              <div className="m-card"><h4>Active Staff</h4><p>{data.metrics?.activeStaff || 24}</p></div>
            </div>
          )}

          {tab === 'audit' && (
            <table className="data-table">
              <thead><tr><th>ID</th><th>EVENT</th><th>OPERATOR</th><th>TIMESTAMP</th></tr></thead>
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