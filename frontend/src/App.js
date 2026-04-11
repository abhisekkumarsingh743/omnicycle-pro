import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = "https://omnicycle-pro.onrender.com";

function App() {
  const [session, setSession] = useState(JSON.parse(localStorage.getItem('icms_v5_session')));
  const [currentTab, setCurrentTab] = useState('inventory');
  const [systemData, setSystemData] = useState({ inventory: [], auditLogs: [], metrics: {} });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session) return;
    const syncData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE}/all-data`);
        setSystemData(response.data);
      } catch (err) {
        console.error("Link with industrial gateway failed.");
      }
      setLoading(false);
    };
    syncData();
  }, [session, currentTab]);

  if (!session) return (
    <div className="login-screen">
      <div className="login-box">
        <h2 style={{color: '#a18e0d', letterSpacing: '4px'}}>OMNICYCLE</h2>
        <p style={{fontSize: '10px', color: '#444', marginBottom: '25px'}}>INDUSTRIAL TERMINAL ACCESS</p>
        <form onSubmit={(e) => { e.preventDefault(); const u={name: "Abhishek Singh"}; localStorage.setItem('icms_v5_session', JSON.stringify(u)); setSession(u); }}>
          <input className="login-input" type="email" placeholder="Terminal ID" required />
          <input className="login-input" type="password" placeholder="Access Password" required />
          <button type="submit" className="btn-gold" style={{width: '100%'}}>INITIALIZE SESSION</button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h3 style={{color: '#a18e0d', marginBottom: '40px'}}>OMNICYCLE PRO</h3>
        <nav style={{flex: 1}}>
          <button className={`nav-item ${currentTab === 'inventory' ? 'active' : ''}`} onClick={() => setCurrentTab('inventory')}>📦 Inventory</button>
          <button className={`nav-item ${currentTab === 'reports' ? 'active' : ''}`} onClick={() => setCurrentTab('reports')}>📊 Reports</button>
          <button className={`nav-item ${currentTab === 'master' ? 'active' : ''}`} onClick={() => setCurrentTab('master')}>📁 Master Data</button>
          <button className={`nav-item ${currentTab === 'audit' ? 'active' : ''}`} onClick={() => setCurrentTab('audit')}>📜 Audit Trail</button>
        </nav>
        <div style={{borderTop: '1px solid #111', paddingTop: '20px'}}>
          <p style={{fontSize: '11px', color: '#555', margin: 0}}>SUPER_ADMIN</p>
          <p style={{fontWeight: 'bold', margin: '5px 0 15px 0'}}>{session.name}</p>
          <button onClick={() => {localStorage.clear(); window.location.reload();}} style={{color: '#ff4d4d', background: 'none', border: 'none', cursor: 'pointer', padding: 0}}>Terminate Session</button>
        </div>
      </aside>

      <main className="main-view">
        <header className="header">
          <h2 style={{margin: 0, textTransform: 'uppercase'}}>{currentTab} Management</h2>
          <div>
            <button className="btn-outline">📄 PDF Export</button>
            <button className="btn-outline">📧 SMTP Mail</button>
            <span style={{color: loading ? '#f1c40f' : '#2ecc71', fontSize: '10px', marginLeft: '15px'}}>● {loading ? 'SYNCING' : 'LIVE'}</span>
          </div>
        </header>

        <div className="workspace-content">
          {currentTab === 'inventory' && (
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th>ID</th><th>ITEM NAME</th><th>CATEGORY</th><th>STOCK</th><th>STATUS</th></tr></thead>
                <tbody>
                  {systemData.inventory.map((item, i) => (
                    <tr key={i}><td>{item.id}</td><td>{item.name}</td><td>{item.category}</td><td style={{color: '#fff', fontWeight: 'bold'}}>{item.stock}</td><td>{item.status}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {currentTab === 'reports' && (
            <div className="grid-3">
              <div className="stat-card"><h4>Efficiency</h4><p>{systemData.metrics?.efficiency || '98.4%'}</p></div>
              <div className="stat-card"><h4>Total Stocks</h4><p>215 Units</p></div>
              <div className="stat-card"><h4>System Health</h4><p style={{color: '#2ecc71'}}>Optimum</p></div>
            </div>
          )}

          {currentTab === 'master' && (
            <div className="grid-3">
              <div className="stat-card"><h4>Warehouses</h4><p>{systemData.metrics?.warehouses || 4}</p></div>
              <div className="stat-card"><h4>Nodes</h4><p>{systemData.metrics?.nodes || 12}</p></div>
              <div className="stat-card"><h4>Uptime</h4><p>{systemData.metrics?.uptime || '99.9%'}</p></div>
            </div>
          )}

          {currentTab === 'audit' && (
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th>LOG ID</th><th>EVENT</th><th>OPERATOR</th><th>TIMESTAMP</th></tr></thead>
                <tbody>
                  {systemData.auditLogs.map((log, i) => (
                    <tr key={i}><td>{log.id}</td><td>{log.event}</td><td>{log.operator}</td><td>{new Date(log.time).toLocaleString()}</td></tr>
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