import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
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
      // Fallback data agar backend se missing ho
      const finalizedData = {
        inventory: res.data.inventory || [],
        metrics: res.data.metrics || { efficiency: "98.4%", nodes: "14", uptime: "99.9%" },
        auditLogs: res.data.auditLogs || [{id: "L-99", event: "System Sync", operator: "Auto", time: new Date()}]
      };
      setData(finalizedData);
    } catch (err) { console.error("Sync Error:", err); }
  };

  // --- Fixed PDF Export ---
  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      doc.text("OMNICYCLE SYSTEM REPORT", 14, 15);
      
      const tableColumn = ["ID", "ASSET NAME", "QTY", "STATUS"];
      const tableRows = data.inventory.map(item => [item.id, item.name, item.stock, item.status]);

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 25,
        theme: 'grid',
        headStyles: { fillColor: [255, 215, 0], textColor: [0, 0, 0] }
      });

      doc.save(`Omnicycle_Report.pdf`);
    } catch (error) {
      alert("PDF Error: Make sure 'jspdf-autotable' is installed.");
    }
  };

  const sendEmail = () => {
    const email = prompt("Enter Admin Email:");
    if (email) window.location.href = `mailto:${email}?subject=System_Report&body=Check Attached PDF.`;
  };

  if (!isLoggedIn) return (
    <div className="login-wrapper">
      <div className="login-glass-card">
        <h1>OMNICYCLE_PRO</h1>
        <form onSubmit={(e) => { e.preventDefault(); localStorage.setItem('isLoggedIn', 'true'); setIsLoggedIn(true); }}>
          <input type="text" placeholder="ADMIN_ACCESS_ID" required />
          <input type="password" placeholder="SECURITY_HASH" required />
          <button type="submit" className="login-submit">INITIALIZE</button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="dashboard-root">
      <aside className="vertical-nav">
        <h1 className="nav-logo">OMNICYCLE</h1>
        <div className="nav-links">
          <button className={activeTab === 'inventory' ? 'n-btn active' : 'n-btn'} onClick={() => setActiveTab('inventory')}>📦 INVENTORY</button>
          <button className={activeTab === 'reports' ? 'n-btn active' : 'n-btn'} onClick={() => setActiveTab('reports')}>📊 ANALYTICS</button>
          <button className={activeTab === 'master' ? 'n-btn active' : 'n-btn'} onClick={() => setActiveTab('master')}>📂 MASTER DATA</button>
          <button className={activeTab === 'audit' ? 'n-btn active' : 'n-btn'} onClick={() => setActiveTab('audit')}>📜 AUDIT TRAIL</button>
        </div>
        <div className="nav-user">
          <p className="u-name">ABHISHEK SINGH</p>
          <p className="u-status">ADMIN_MODE</p>
          <button className="logout-action" onClick={() => { localStorage.clear(); setIsLoggedIn(false); }}>TERMINATE</button>
        </div>
      </aside>

      <main className="main-viewport">
        <header className="viewport-header">
          <h2>{activeTab.toUpperCase()} PANEL</h2>
          <div className="header-actions">
            <button className="util-btn gold" onClick={exportToPDF}>📄 EXPORT PDF</button>
            <button className="util-btn" onClick={sendEmail}>📧 SEND MAIL</button>
          </div>
        </header>

        <div className="scroll-content">
          {activeTab === 'inventory' && (
            <div className="table-wrapper">
              <div className="table-top"><h3>Live Inventory</h3><button className="prime-btn" onClick={() => setShowAddForm(true)}>+ ADD ITEMS</button></div>
              <table>
                <thead><tr><th>REF_ID</th><th>NAME</th><th>QTY</th><th>STATUS</th><th>ACTION</th></tr></thead>
                <tbody>
                  {data.inventory.map(item => (
                    <tr key={item.id}>
                      <td className="mono">{item.id}</td><td>{item.name}</td><td>{item.stock}</td>
                      <td><span className={`badge ${item.status.toLowerCase()}`}>{item.status}</span></td>
                      <td><button onClick={async () => { await axios.delete(`${API_BASE}/delete-item/${item.id}`); fetchData(); }}>🗑️</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {(activeTab === 'reports' || activeTab === 'master') && (
            <div className="table-wrapper">
              <h3>System Master Metrics</h3>
              <table>
                <thead><tr><th>PARAMETER</th><th>VALUE</th><th>STATUS</th></tr></thead>
                <tbody>
                  <tr><td>Global Efficiency</td><td>{data.metrics.efficiency}</td><td className="green">OPTIMAL</td></tr>
                  <tr><td>Database Connection</td><td>{data.metrics.uptime}</td><td className="green">ONLINE</td></tr>
                  <tr><td>Active Edge Nodes</td><td>{data.metrics.nodes}</td><td className="green">SYNCED</td></tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="table-wrapper">
              <h3>Security Logs</h3>
              <table>
                <thead><tr><th>LOG_ID</th><th>EVENT</th><th>OPERATOR</th><th>TIME</th></tr></thead>
                <tbody>
                  {data.auditLogs.map(log => (
                    <tr key={log.id}><td>{log.id}</td><td>{log.event}</td><td>{log.operator}</td><td>{new Date(log.time).toLocaleTimeString()}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showAddForm && (
          <div className="modal-bg">
            <form className="add-form-card" onSubmit={async (e) => {
               e.preventDefault();
               await axios.post(`${API_BASE}/add-item`, newItem);
               setShowAddForm(false); fetchData();
            }}>
              <h3>NEW ASSET</h3>
              <input placeholder="Name" onChange={e => setNewItem({...newItem, name: e.target.value})} required />
              <input placeholder="Category" onChange={e => setNewItem({...newItem, category: e.target.value})} required />
              <input type="number" placeholder="Stock" onChange={e => setNewItem({...newItem, stock: e.target.value})} required />
              <button type="submit" className="save-btn">CONFIRM</button>
              <button type="button" onClick={() => setShowAddForm(false)}>CANCEL</button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;