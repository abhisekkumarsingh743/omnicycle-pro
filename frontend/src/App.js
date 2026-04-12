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

  // Naya Delete Logic
  const deleteItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`${API_BASE}/delete-item/${id}`);
        fetchData(); // UI refresh karne ke liye
      } catch (err) {
        alert("Delete Failed: Backend connectivity issue.");
      }
    }
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
      const subject = encodeURIComponent("Omnicycle System Data Report");
      const body = encodeURIComponent(`System Summary:\nEfficiency: ${data.metrics.efficiency}\nTotal Nodes: ${data.metrics.nodes}\n\nPlease check the dashboard for detailed inventory.`);
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    }
  };

  if (!isLoggedIn) return (
    <div className="login-wrapper">
      <div className="login-glass-card">
        <h1>OMNICYCLE</h1>
        <form onSubmit={(e) => { e.preventDefault(); localStorage.setItem('isLoggedIn', 'true'); setIsLoggedIn(true); }}>
          <div className="input-group">
            <input type="text" placeholder="USER_ID" required />
            <input type="password" placeholder="USER_PASSWORD" required />
          </div>
          <button type="submit" className="login-submit">LOGIN</button>
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
                <thead><tr><th>REF_ID</th><th>NAME</th><th>QTY</th><th>STATUS</th><th>ACTION</th></tr></thead>
                <tbody>
                  {data.inventory.map(item => (
                    <tr key={item.id}>
                      <td className="mono">{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.stock}</td>
                      <td><span className={`badge ${item.status.toLowerCase()}`}>{item.status}</span></td>
                      <td>
                        <button className="delete-btn" onClick={() => deleteItem(item.id)}>🗑️</button>
                      </td>
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
                <thead><tr><th>PARAMETER</th><th>VALUE</th><th>STATUS</th></tr></thead>
                <tbody>
                  <tr><td>System Efficiency</td><td>{data.metrics.efficiency}</td><td className="green">OPTIMAL</td></tr>
                  <tr><td>Cluster Nodes</td><td>{data.metrics.nodes}</td><td className="green">ONLINE</td></tr>
                  <tr><td>Database Uptime</td><td>{data.metrics.uptime}</td><td className="green">HEALTHY</td></tr>
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
                  {data.auditLogs.map(log => (
                    <tr key={log.id}><td>{log.id}</td><td>{log.event}</td><td>{new Date(log.time).toLocaleTimeString()}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

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