import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './App.css';

// Local environment ke liye base URL
const API_BASE = "http://localhost:8000";

function App() {
  const [data, setData] = useState({ inventory: [], metrics: {}, auditLogs: [] });
  const [activeTab, setActiveTab] = useState('inventory');
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', category: '', stock: '', status: 'Active' });

  useEffect(() => { 
    if (isLoggedIn) fetchData(); 
  }, [isLoggedIn]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_BASE}/all-data`);
      setData({
        inventory: res.data.inventory || [],
        metrics: res.data.metrics || { efficiency: "98.4%", nodes: "14", uptime: "99.9%" },
        auditLogs: res.data.auditLogs || []
      });
    } catch (err) { 
      console.error("Sync Error: Backend not reachable"); 
    }
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      doc.text("OMNICYCLE SYSTEM REPORT", 14, 15);
      const tableRows = (data.inventory || []).map(item => [
        item.id || 'N/A', 
        item.name || '---', 
        item.category || '---', 
        item.stock || 0, 
        item.status || 'Active'
      ]);
      autoTable(doc, {
        head: [["ID", "NAME", "CATEGORY", "QTY", "STATUS"]],
        body: tableRows,
        startY: 25,
        theme: 'grid',
        headStyles: { fillColor: [255, 215, 0], textColor: [0, 0, 0] }
      });
      doc.save("Omnicycle_Report.pdf");
    } catch (e) { alert("PDF Export Failed"); }
  };

  if (!isLoggedIn) return (
    <div className="login-wrapper">
      <div className="login-glass-card">
        <h1>OMNICYCLE</h1>
        <form onSubmit={(e) => { e.preventDefault(); localStorage.setItem('isLoggedIn', 'true'); setIsLoggedIn(true); }}>
          <div className="input-group">
            <input type="text" placeholder="IDENTITY_KEY" required />
            <input type="password" placeholder="SECURE_HASH" required />
          </div>
          <button type="submit" className="login-submit">INITIALIZE COMMAND CENTER</button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="dashboard-root">
      {/* Sidebar - Desktop Only */}
      <aside className="vertical-nav">
        <h1 className="nav-logo">OMNICYCLE</h1>
        <nav className="nav-links">
          <button className={activeTab === 'inventory' ? 'n-btn active' : 'n-btn'} onClick={() => setActiveTab('inventory')}>📦 INVENTORY</button>
          <button className={activeTab === 'reports' ? 'n-btn active' : 'n-btn'} onClick={() => setActiveTab('reports')}>📊 ANALYTICS</button>
          <button className={activeTab === 'master' ? 'n-btn active' : 'n-btn'} onClick={() => setActiveTab('master')}>📂 MASTER DATA</button>
          <button className={activeTab === 'audit' ? 'n-btn active' : 'n-btn'} onClick={() => setActiveTab('audit')}>📜 AUDIT TRAIL</button>
        </nav>
        <div className="nav-user">
          <div className="user-info">
            <p className="u-label">LOGGED AS:</p>
            <p className="u-name">ADMINISTRATOR</p>
            <p className="u-status">● SYSTEM_ONLINE</p>
          </div>
          <button className="logout-action" onClick={() => { localStorage.clear(); setIsLoggedIn(false); }}>TERMINATE ACCESS</button>
        </div>
      </aside>

      <main className="main-viewport">
        <header className="viewport-header">
          <h2>{activeTab.toUpperCase()}</h2>
          <div className="header-actions">
            <button className="util-btn gold" onClick={exportToPDF}>📄 PDF</button>
            <button className="util-btn desktop-only" onClick={() => window.print()}>📧 PRINT</button>
          </div>
        </header>

        <div className="scroll-content">
          {activeTab === 'inventory' && (
            <div className="table-wrapper">
              <div className="table-top">
                <h3>Live Asset Nodes</h3>
                <button className="prime-btn" onClick={() => setShowAddForm(true)}>+ ADD</button>
              </div>
              <div className="table-scroll">
                <table>
                  <thead><tr><th>REF_ID</th><th>NAME</th><th>QTY</th><th>STATUS</th></tr></thead>
                  <tbody>
                    {data.inventory.length > 0 ? data.inventory.map((item, i) => (
                      <tr key={item.id || i}>
                        <td className="mono">{item.id || 'N/A'}</td>
                        <td>{item.name || '---'}</td>
                        <td>{item.stock || 0}</td>
                        <td><span className={`badge ${(item.status || 'Active').toLowerCase()}`}>{item.status || 'Active'}</span></td>
                      </tr>
                    )) : <tr><td colSpan="4" style={{textAlign:'center', padding:'20px'}}>No data synced from server.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {(activeTab === 'reports' || activeTab === 'master') && (
            <div className="table-wrapper">
              <h3>System Metrics</h3>
              <table>
                <thead><tr><th>PARAMETER</th><th>VALUE</th><th>STATUS</th></tr></thead>
                <tbody>
                  <tr><td>System Efficiency</td><td>{data.metrics.efficiency || "98.4%"}</td><td className="green">OPTIMAL</td></tr>
                  <tr><td>Cluster Nodes</td><td>{data.metrics.nodes || "14"}</td><td className="green">ONLINE</td></tr>
                  <tr><td>Database Uptime</td><td>{data.metrics.uptime || "99.9%"}</td><td className="green">HEALTHY</td></tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="table-wrapper">
              <h3>System Logs</h3>
              <table>
                <thead><tr><th>ID</th><th>EVENT</th><th>TIME</th></tr></thead>
                <tbody>
                  {data.auditLogs.length > 0 ? data.auditLogs.map((log, i) => (
                    <tr key={i}>
                      <td>{log.id || i+1}</td>
                      <td>{log.event}</td>
                      <td>{log.time ? new Date(log.time).toLocaleTimeString() : 'NOW'}</td>
                    </tr>
                  )) : <tr><td colSpan="3" style={{textAlign:'center'}}>Logs empty.</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="mobile-bottom-nav">
          <button className={activeTab === 'inventory' ? 'm-btn active' : 'm-btn'} onClick={() => setActiveTab('inventory')}>📦</button>
          <button className={activeTab === 'reports' ? 'm-btn active' : 'm-btn'} onClick={() => setActiveTab('reports')}>📊</button>
          <button className={activeTab === 'master' ? 'm-btn active' : 'm-btn'} onClick={() => setActiveTab('master')}>📂</button>
          <button className={activeTab === 'audit' ? 'm-btn active' : 'm-btn'} onClick={() => setActiveTab('audit')}>📜</button>
        </nav>

        {showAddForm && (
          <div className="modal-bg">
            <div className="modal-card">
              <h3>REGISTER NEW ITEM</h3>
              <form className="modal-form" onSubmit={async (e) => { e.preventDefault(); await axios.post(`${API_BASE}/add-item`, newItem); setShowAddForm(false); fetchData(); }}>
                <input placeholder="Name" onChange={e => setNewItem({...newItem, name: e.target.value})} required />
                <input placeholder="Category" onChange={e => setNewItem({...newItem, category: e.target.value})} required />
                <input type="number" placeholder="Quantity" onChange={e => setNewItem({...newItem, stock: e.target.value})} required />
                <div className="modal-footer">
                  <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>CANCEL</button>
                  <button type="submit" className="confirm-btn">CONFIRM</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;