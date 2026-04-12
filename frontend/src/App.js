import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './App.css';

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
      // Backend response structure check
      const fetchedData = res.data.data || res.data; 
      
      setData({
        inventory: fetchedData.inventory || [],
        metrics: fetchedData.metrics || { efficiency: "98.4%", nodes: "14", uptime: "99.9%" },
        auditLogs: fetchedData.auditLogs || []
      });
    } catch (err) { 
      console.error("Connection Refused at Port 8000"); 
    }
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      doc.text("OMNICYCLE SYSTEM REPORT", 14, 15);
      const rows = data.inventory.map(item => [item.id || 'N/A', item.name, item.category, item.stock, item.status]);
      autoTable(doc, { head: [["ID", "NAME", "CAT", "QTY", "STATUS"]], body: rows, startY: 25 });
      doc.save("Omnicycle_Report.pdf");
    } catch (e) { alert("PDF Error"); }
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
      {/* Sidebar Desktop */}
      <aside className="vertical-nav">
        <h1 className="nav-logo">OMNICYCLE</h1>
        <nav className="nav-links">
          <button className={activeTab === 'inventory' ? 'n-btn active' : 'n-btn'} onClick={() => setActiveTab('inventory')}>📦 INVENTORY</button>
          <button className={activeTab === 'reports' ? 'n-btn active' : 'n-btn'} onClick={() => setActiveTab('reports')}>📊 ANALYTICS</button>
          <button className={activeTab === 'master' ? 'n-btn active' : 'n-btn'} onClick={() => setActiveTab('master')}>📂 MASTER DATA</button>
          <button className={activeTab === 'audit' ? 'n-btn active' : 'n-btn'} onClick={() => setActiveTab('audit')}>📜 AUDIT TRAIL</button>
        </nav>
        <div className="nav-user">
          <p className="u-label">LOGGED AS:</p>
          <p className="u-name">ADMINISTRATOR</p>
          <button className="logout-action" onClick={() => { localStorage.clear(); setIsLoggedIn(false); }}>TERMINATE</button>
        </div>
      </aside>

      <main className="main-viewport">
        <header className="viewport-header">
          <h2>{activeTab.toUpperCase()}</h2>
          <div className="header-actions">
            <button className="util-btn gold" onClick={exportToPDF}>📄 PDF</button>
          </div>
        </header>

        <div className="scroll-content">
          {activeTab === 'inventory' && (
            <div className="table-wrapper">
              <div className="table-top">
                <h3>Asset Nodes</h3>
                <button className="prime-btn" onClick={() => setShowAddForm(true)}>+ ADD</button>
              </div>
              <div className="table-responsive-box">
                <table>
                  <thead><tr><th>ID</th><th>NAME</th><th>QTY</th><th>STATUS</th></tr></thead>
                  <tbody>
                    {data.inventory.length > 0 ? data.inventory.map((item, i) => (
                      <tr key={item.id || i}>
                        <td className="mono">{item.id || i+101}</td>
                        <td>{item.name}</td>
                        <td>{item.stock}</td>
                        <td><span className={`badge ${(item.status || 'active').toLowerCase()}`}>{item.status || 'Active'}</span></td>
                      </tr>
                    )) : <tr><td colSpan="4" style={{textAlign:'center', padding:'40px'}}>Waiting for Backend Sync...</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="table-wrapper">
              <h3>System Logs</h3>
              <table>
                <thead><tr><th>EVENT</th><th>TIMESTAMP</th></tr></thead>
                <tbody>
                  {data.auditLogs.map((log, i) => (
                    <tr key={i}>
                      <td>{log.event}</td>
                      <td>{log.time ? new Date(log.time).toLocaleTimeString() : 'Recent'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Mobile Navbar */}
        <nav className="mobile-nav">
          <button className={activeTab === 'inventory' ? 'm-btn active' : 'm-btn'} onClick={() => setActiveTab('inventory')}>📦</button>
          <button className={activeTab === 'reports' ? 'm-btn active' : 'm-btn'} onClick={() => setActiveTab('reports')}>📊</button>
          <button className={activeTab === 'master' ? 'm-btn active' : 'm-btn'} onClick={() => setActiveTab('master')}>📂</button>
          <button className={activeTab === 'audit' ? 'm-btn active' : 'm-btn'} onClick={() => setActiveTab('audit')}>📜</button>
        </nav>

        {showAddForm && (
          <div className="modal-bg">
            <div className="modal-card">
              <h3>NEW ENTRY</h3>
              <form className="modal-form" onSubmit={async (e) => { e.preventDefault(); await axios.post(`${API_BASE}/add-item`, newItem); setShowAddForm(false); fetchData(); }}>
                <input placeholder="Name" onChange={e => setNewItem({...newItem, name: e.target.value})} required />
                <input placeholder="Category" onChange={e => setNewItem({...newItem, category: e.target.value})} required />
                <input type="number" placeholder="Quantity" onChange={e => setNewItem({...newItem, stock: e.target.value})} required />
                <div className="modal-footer">
                  <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>CANCEL</button>
                  <button type="submit" className="confirm-btn">ADD</button>
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