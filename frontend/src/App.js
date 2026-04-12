import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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
      setData({
        inventory: res.data.inventory || [],
        metrics: res.data.metrics || { efficiency: "98.4%", nodes: "14", uptime: "99.9%" },
        auditLogs: res.data.auditLogs || []
      });
    } catch (err) { console.error("Sync Error"); }
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      doc.text("OMNICYCLE SYSTEM REPORT", 14, 15);
      const tableRows = data.inventory.map(item => [item.id, item.name, item.category, item.stock, item.status]);
      autoTable(doc, {
        head: [["ID", "NAME", "CATEGORY", "QTY", "STATUS"]],
        body: tableRows,
        startY: 25,
        theme: 'grid',
        headStyles: { fillColor: [255, 215, 0], textColor: [0, 0, 0] }
      });
      doc.save("Omnicycle_Report.pdf");
    } catch (e) { alert("PDF Error"); }
  };

  const sendEmail = () => {
    const email = prompt("Enter Recipient Email:");
    if (email) {
      window.location.href = `mailto:${email}?subject=Omnicycle_Report&body=System_Status_Alert`;
    }
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
          <button type="submit" className="login-submit">INITIALIZE</button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="dashboard-root">
      {/* Sidebar - Desktop & Tablet Only */}
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
          </div>
          <button className="logout-action" onClick={() => { localStorage.clear(); setIsLoggedIn(false); }}>TERMINATE</button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        <button className={activeTab === 'inventory' ? 'm-btn active' : 'm-btn'} onClick={() => setActiveTab('inventory')}>📦</button>
        <button className={activeTab === 'reports' ? 'm-btn active' : 'm-btn'} onClick={() => setActiveTab('reports')}>📊</button>
        <button className={activeTab === 'master' ? 'm-btn active' : 'm-btn'} onClick={() => setActiveTab('master')}>📂</button>
        <button className={activeTab === 'audit' ? 'm-btn active' : 'm-btn'} onClick={() => setActiveTab('audit')}>📜</button>
      </nav>

      <main className="main-viewport">
        <header className="viewport-header">
          <h2>{activeTab.toUpperCase()}</h2>
          <div className="header-actions">
            <button className="util-btn gold mobile-hide" onClick={exportToPDF}>📄 PDF</button>
            <button className="util-btn mobile-hide" onClick={sendEmail}>📧 MAIL</button>
          </div>
        </header>

        <div className="scroll-content">
          <div className="responsive-table-container">
            {activeTab === 'inventory' && (
              <div className="table-wrapper">
                <div className="table-top">
                  <h3>Live Assets</h3>
                  <button className="prime-btn" onClick={() => setShowAddForm(true)}>+ ADD</button>
                </div>
                <table>
                  <thead><tr><th>REF</th><th>NAME</th><th>QTY</th><th className="tab-hide">STATUS</th></tr></thead>
                  <tbody>
                    {data.inventory.map(item => (
                      <tr key={item.id}>
                        <td className="mono">{item.id.slice(-4)}</td>
                        <td>{item.name}</td>
                        <td>{item.stock}</td>
                        <td className="tab-hide"><span className={`badge ${item.status.toLowerCase()}`}>{item.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {(activeTab === 'reports' || activeTab === 'master') && (
              <div className="table-wrapper">
                <h3>System Metrics</h3>
                <table>
                  <thead><tr><th>METRIC</th><th>VAL</th></tr></thead>
                  <tbody>
                    <tr><td>Efficiency</td><td>{data.metrics.efficiency}</td></tr>
                    <tr><td>Nodes</td><td>{data.metrics.nodes}</td></tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {showAddForm && (
          <div className="modal-bg">
            <div className="modal-card">
              <h3>ADD ITEM</h3>
              <form className="modal-form" onSubmit={async (e) => { e.preventDefault(); await axios.post(`${API_BASE}/add-item`, newItem); setShowAddForm(false); fetchData(); }}>
                <input placeholder="Name" onChange={e => setNewItem({...newItem, name: e.target.value})} required />
                <input type="number" placeholder="Qty" onChange={e => setNewItem({...newItem, stock: e.target.value})} required />
                <div className="modal-footer">
                  <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>X</button>
                  <button type="submit" className="confirm-btn">SAVE</button>
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