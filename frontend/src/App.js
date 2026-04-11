import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = "https://omnicycle-pro.onrender.com";

function App() {
  const [session, setSession] = useState(JSON.parse(localStorage.getItem('session')));
  const [view, setView] = useState('inventory');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Auto-Sync for Live System Status
  useEffect(() => {
    if (!session) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/all-data`);
        setData(res.data || []);
      } catch (err) {
        console.error("Gateway Sync Failed - Using Local Cache");
      }
      setLoading(false);
    };
    fetchData();
  }, [session, view]);

  // Handle Session Initialization
  const handleLogin = (e) => {
    e.preventDefault();
    const newUser = { name: "Abhishek Singh", role: "ADMIN_SESSION" };
    setSession(newUser);
    localStorage.setItem('session', JSON.stringify(newUser));
  };

  if (!session) return (
    <div className="login-overlay">
      <div className="login-box">
        <h2 style={{color: 'var(--gold)', letterSpacing: '4px'}}>OMNICYCLE</h2>
        <p style={{fontSize: '11px', color: '#666', marginBottom: '30px'}}>INDUSTRIAL CMS PRO V2.0</p>
        <form onSubmit={handleLogin}>
          <input className="stat-card" style={{width: '100%', marginBottom: '15px', padding: '12px', background: '#000'}} placeholder="Terminal ID / Email" required />
          <button className="btn-action" style={{width: '100%', padding: '14px', background: 'var(--gold)', color: '#000', fontWeight: 'bold'}}>INITIALIZE SESSION</button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h3 style={{color: 'var(--gold)', marginBottom: '40px'}}>OMNICYCLE PRO</h3>
        <nav style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
          <button onClick={() => setView('inventory')} style={{color: view==='inventory'?'var(--gold)':'#555'}} className="btn-action">📦 Inventory</button>
          <button onClick={() => setView('reports')} style={{color: view==='reports'?'var(--gold)':'#555'}} className="btn-action">📊 Reports</button>
          <button onClick={() => setView('audit')} style={{color: view==='audit'?'var(--gold)':'#555'}} className="btn-action">📜 Audit Trail</button>
          <button onClick={() => setView('master')} style={{color: view==='master'?'var(--gold)':'#555'}} className="btn-action">📁 Master Data</button>
        </nav>
        <div style={{marginTop: 'auto', borderTop: '1px solid #222', paddingTop: '20px'}}>
          <p style={{fontSize: '12px', color: '#999'}}>{session.role}</p>
          <p style={{fontWeight: 'bold'}}>{session.name}</p>
          <button onClick={() => {localStorage.clear(); window.location.reload();}} style={{color: '#ff4d4d', marginTop: '10px', width: '100%'}} className="btn-action">Terminate Session</button>
        </div>
      </aside>

      <main className="main-stage">
        <header className="view-header">
          <h2 style={{margin: 0, textTransform: 'uppercase'}}>{view} Management</h2>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <button className="btn-action">📄 Export PDF</button>
            <button className="btn-action">📧 Send Mail</button>
            <span style={{marginLeft: '20px', fontSize: '10px', color: loading ? '#f1c40f' : '#2ecc71'}}>
              ● {loading ? 'SYNCING_GATEWAY' : 'LIVE_SYSTEM'}
            </span>
          </div>
        </header>

        <div style={{padding: '40px'}}>
          {view === 'inventory' && (
            <div className="stat-card">
              <h4>Current Inventory Levels</h4>
              {/* Table logic here */}
              <p>System is generating data for {view}...</p>
            </div>
          )}

          {view === 'reports' && (
            <div className="stat-card">
              <h4>System Reports Analytics</h4>
              <p style={{color: '#666'}}>No critical anomalies detected in the last 24 hours.</p>
            </div>
          )}

          {view === 'master' && (
            <div className="grid-container">
              <div className="stat-card"><h4>Active Warehouses</h4><p style={{fontSize: '32px'}}>04</p></div>
              <div className="stat-card"><h4>Connected Nodes</h4><p style={{fontSize: '32px'}}>12</p></div>
              <div className="stat-card"><h4>Uptime</h4><p style={{fontSize: '32px'}}>99.9%</p></div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;