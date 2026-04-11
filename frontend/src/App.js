import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API = "https://omnicycle-pro.onrender.com";

function App() {
  const [session, setSession] = useState(JSON.parse(localStorage.getItem('icms_session')));
  const [tab, setTab] = useState('inventory');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ inventory: [], auditLogs: [], metrics: {} });

  useEffect(() => {
    if (!session) return;
    const sync = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/all-data`);
        setData(res.data);
      } catch (e) {
        console.error("API Link Broken - Using fallback state");
      }
      setLoading(false);
    };
    sync();
  }, [session, tab]);

  if (!session) return (
    <div className="login-screen">
      <div className="login-box">
        <h2 style={{color: '#a18e0d', letterSpacing: '3px'}}>OMNICYCLE</h2>
        <p style={{fontSize: '10px', color: '#444', marginBottom: '25px'}}>ADMIN TERMINAL ACCESS</p>
        <form onSubmit={(e) => { e.preventDefault(); const user={name: "Abhishek Singh"}; localStorage.setItem('icms_session', JSON.stringify(user)); setSession(user); }}>
          <input className="login-input" type="email" placeholder="Terminal ID" required />
          <input className="login-input" type="password" placeholder="Access Code" required />
          <button type="submit" className="btn-gold">INITIALIZE SESSION</button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h3 style={{color: '#a18e0d', marginBottom: '40px'}}>OMNICYCLE PRO</h3>
        <nav style={{flex: 1}}>
          <button className={`nav-btn ${tab === 'inventory' ? 'active' : ''}`} onClick={() => setTab('inventory')}>📦 Inventory</button>
          <button className={`nav-btn ${tab === 'master' ? 'active' : ''}`} onClick={() => setTab('master')}>📁 Master Data</button>
          <button className={`nav-btn ${tab === 'audit' ? 'active' : ''}`} onClick={() => setTab('audit')}>📜 Audit Trail</button>
        </nav>
        <div style={{borderTop: '1px solid #111', paddingTop: '20px'}}>
          <p style={{fontSize: '11px', color: '#555', margin: 0}}>ADMIN_PRO</p>
          <p style={{fontWeight: 'bold', margin: '5px 0 15px 0'}}>{session.name}</p>
          <button onClick={() => {localStorage.clear(); window.location.reload();}} style={{color: '#ff4d4d', background: 'none', border: 'none', cursor: 'pointer', padding: 0}}>Terminate Session</button>
        </div>
      </aside>

      <main className="workspace">
        <header className="header">
          <h2 style={{margin: 0, textTransform: 'uppercase'}}>{tab} Management</h2>
          <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
            <button className="nav-btn" style={{border: '1px solid #222', width: 'auto', padding: '8px 15px'}}>📄 Export PDF</button>
            <button className="nav-btn" style={{border: '1px solid #222', width: 'auto', padding: '8px 15px'}}>📧 Mail</button>
            <span style={{color: loading ? '#f1c40f' : '#2ecc71', fontSize: '10px', marginLeft: '10px'}}>● {loading ? 'SYNCING' : 'LIVE'}</span>
          </div>
        </header>

        <div className="content">
          {tab === 'inventory' && (
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th>ID</th><th>ITEM NAME</th><th>CATEGORY</th><th>STOCK</th><th>STATUS</th></tr></thead>
                <tbody>
                  {data.inventory.length > 0 ? data.inventory.map((item, i) => (
                    <tr key={i}><td>{item.id}</td><td>{item.name}</td><td>{item.category}</td><td style={{color: '#fff', fontWeight: 'bold'}}>{item.stock}</td><td>{item.status}</td></tr>
                  )) : <tr><td colSpan="5" style={{textAlign: 'center'}}>Syncing Inventory...</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'master' && (
            <div className="grid-cards">
              <div className="m-card"><h4>Warehouses</h4><p>{data.metrics?.warehouses || 4}</p></div>
              <div className="m-card"><h4>Nodes</h4><p>{data.metrics?.nodes || 12}</p></div>
              <div className="m-card"><h4>Uptime</h4><p>{data.metrics?.uptime || '99.9%'}</p></div>
              <div className="m-card"><h4>Active Staff</h4><p>{data.metrics?.activeStaff || 24}</p></div>
            </div>
          )}

          {tab === 'audit' && (
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th>LOG ID</th><th>EVENT</th><th>OPERATOR</th><th>TIMESTAMP</th></tr></thead>
                <tbody>
                  {data.auditLogs.map((log, i) => (
                    <tr key={i}><td>{log.id}</td><td>{log.event}</td><td>{log.user}</td><td>{new Date(log.timestamp).toLocaleString()}</td></tr>
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