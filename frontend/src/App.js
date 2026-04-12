import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Direct import for stability
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
        auditLogs: res.data.auditLogs || [{id: "L-1", event: "Initial Sync", operator: "System", time: new Date()}]
      });
    } catch (err) { console.error("Sync Error"); }
  };

  // --- Fixed PDF Logic ---
  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("OMNICYCLE SYSTEM REPORT", 14, 15);
      doc.setFontSize(10);
      doc.text(`Timestamp: ${new Date().toLocaleString()}`, 14, 22);

      const tableColumn = ["ID", "ASSET NAME", "CATEGORY", "STOCK", "STATUS"];
      const tableRows = data.inventory.map(item => [
        item.id, item.name, item.category, item.stock, item.status
      ]);

      // Using autoTable directly from the import
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        theme: 'grid',
        headStyles: { fillColor: [255, 215, 0], textColor: [0, 0, 0], fontStyle: 'bold' },
        styles: { fontSize: 9 }
      });

      doc.save(`Omnicycle_Report_${Date.now()}.pdf`);
    } catch (error) {
      console.error(error);
      alert("PDF Export Failed. Please check console.");
    }
  };

  const sendEmail = () => {
    const email = prompt("Enter Recipient Email:");
    if (email) window.location.href = `mailto:${email}?subject=Omnicycle_Report&body=Attached system status.`;
  };

  if (!isLoggedIn) return (
    <div className="login-wrapper">
      <div className="login-glass-card">
        <h1>OMNICYCLE</h1>
        <form onSubmit={(e) => { e.preventDefault(); localStorage.setItem('isLoggedIn', 'true'); setIsLoggedIn(true); }}>
          <input type="text" placeholder="IDENTITY_KEY" required />
          <input type="password" placeholder="SECURE_HASH" required />
          <button type="submit" className="login-submit">INITIALIZE COMMAND CENTER</button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="dashboard-root">
      <aside className="vertical-nav">
        <h1 className="nav-logo">OMNICYCLE</h1>
        <nav className="nav-links">
          <button className={activeTab === 'inventory' ? 'n-btn active' : 'n-btn'} onClick={() => setActiveTab('inventory')}>📦 INVENTORY</button>
          <button className={activeTab === 'reports' ? 'n-btn active' : 'n-btn'} onClick={() => setActiveTab('reports')}>📊 ANALYTICS</button>
          <button className={activeTab === 'master' ? 'n-btn active' : 'n-btn'} onClick={() => setActiveTab('master')}>📂 MASTER DATA</button>
          <button className={activeTab === 'audit' ? 'n-btn active' : 'n-btn'} onClick={() => setActiveTab('audit')}>📜 AUDIT TRAIL</button>
        </nav>
        <div className="nav-user">
          <p className="u-name">ABHISHEK SINGH</p>
          <p className="u-status">ADMINISTRATOR</p>
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
              <div className="table-top">
                <h3>Live Asset Nodes</h3>
                <button className="prime-btn" onClick={() => setShowAddForm(true)}>+ ADD ITEMS</button>
              </div>
              <table>
                <thead><tr><th>REF_ID</th><th>NAME</th><th>CAT</th><th>QTY</th><th>STATUS</th><th>OP</th></tr></thead>
                <tbody>
                  {data.inventory.map(item => (
                    <tr key={item.id}>
                      <td className="mono">{item.id}</td><td>{item.name}</td><td>{item.category}</td><td>{item.stock}</td>
                      <td><span className={`badge ${item.status.toLowerCase()}`}>{item.status}</span></td>
                      <td><button onClick={async () => { await axios.delete(`${API_BASE}/delete-item/${item.id}`); fetchData(); }} className="trash-btn">🗑️</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {(activeTab === 'reports' || activeTab === 'master') && (
            <div className="table-wrapper">
              <h3>System Operational Master Data</h3>
              <table>
                <thead><tr><th>METRIC PARAMETER</th><th>CURRENT VALUE</th><th>TARGET</th><th>STATUS</th></tr></thead>
                <tbody>
                  <tr><td>System Efficiency Index</td><td>{data.metrics.efficiency}</td><td>95.0%</td><td className="green">OPTIMAL</td></tr>
                  <tr><td>Active Cluster Nodes</td><td>{data.metrics.nodes} Units</td><td>10 Units</td><td className="green">ONLINE</td></tr>
                  <tr><td>Network Uptime</td><td>{data.metrics.uptime}</td><td>99.0%</td><td className="green">STABLE</td></tr>
                  <tr><td>Database Health</td><td>SYNCED</td><td>--</td><td className="green">HEALTHY</td></tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="table-wrapper">
              <h3>Access & Change Logs</h3>
              <table>
                <thead><tr><th>LOG_ID</th><th>EVENT TYPE</th><th>OPERATOR</th><th>TIME</th></tr></thead>
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
              <h3>REGISTER NEW NODE</h3>
              <input placeholder="Asset Name" onChange={e => setNewItem({...newItem, name: e.target.value})} required />
              <input placeholder="Category" onChange={e => setNewItem({...newItem, category: e.target.value})} required />
              <input type="number" placeholder="Stock Quantity" onChange={e => setNewItem({...newItem, stock: e.target.value})} required />
              <button type="submit" className="save-btn">CONFIRM ADDITION</button>
              <button type="button" onClick={() => setShowAddForm(false)}>CANCEL</button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;