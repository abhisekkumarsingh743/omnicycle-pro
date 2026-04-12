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
        auditLogs: res.data.auditLogs || [{id: "L-1", event: "Initial Sync", operator: "System", time: new Date()}]
      });
    } catch (err) { console.error("Sync Error"); }
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("OMNICYCLE SYSTEM REPORT", 14, 15);
      const tableColumn = ["ID", "ASSET NAME", "CATEGORY", "STOCK", "STATUS"];
      const tableRows = data.inventory.map(item => [item.id, item.name, item.category, item.stock, item.status]);
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        theme: 'grid',
        headStyles: { fillColor: [255, 215, 0], textColor: [0, 0, 0] }
      });
      doc.save(`Omnicycle_Report_${Date.now()}.pdf`);
    } catch (error) { alert("PDF Export Failed."); }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) return (
    <div className="login-wrapper">
      <div className="login-glass-card">
        <h1>OMNICYCLE</h1>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="IDENTITY_KEY" required />
          <input type="password" placeholder="SECURE_HASH" required />
          <button type="submit" className="login-submit">INITIALIZE</button>
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
            <button className="util-btn" onClick={() => alert("Mail system ready")}>📧 SEND MAIL</button>
          </div>
        </header>

        <div className="scroll-content">
          {activeTab === 'inventory' && (
            <div className="table-wrapper">
              <div className="table-top">
                <h3>Live Inventory</h3>
                <button className="prime-btn" onClick={() => setShowAddForm(true)}>+ ADD ITEMS</button>
              </div>
              <table>
                <thead><tr><th>REF_ID</th><th>NAME</th><th>QTY</th><th>STATUS</th><th>OP</th></tr></thead>
                <tbody>
                  {data.inventory.map(item => (
                    <tr key={item.id}>
                      <td className="mono">{item.id}</td><td>{item.name}</td><td>{item.stock}</td>
                      <td><span className={`badge ${item.status.toLowerCase()}`}>{item.status}</span></td>
                      <td><button onClick={async () => { await axios.delete(`${API_BASE}/delete-item/${item.id}`); fetchData(); }} className="trash-btn">🗑️</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* ... baki tabs ka code same rahega ... */}
        </div>

        {showAddForm && (
          <div className="modal-bg">
            <div className="modal-card">
              <div className="modal-header">
                <h3>REGISTER NEW ITEM</h3>
                <p>Enter asset details for system synchronization</p>
              </div>
              <form className="modal-form" onSubmit={async (e) => {
                 e.preventDefault();
                 await axios.post(`${API_BASE}/add-item`, newItem);
                 setShowAddForm(false); fetchData();
              }}>
                <div className="form-group">
                  <label>ITEM NAME</label>
                  <input placeholder="Ex: Server Node Alpha" onChange={e => setNewItem({...newItem, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>CATEGORY</label>
                  <input placeholder="Ex: Hardware" onChange={e => setNewItem({...newItem, category: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>QUANTITY</label>
                  <input type="number" placeholder="0" onChange={e => setNewItem({...newItem, stock: e.target.value})} required />
                </div>
                <div className="modal-footer">
                  <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>DISCARD</button>
                  <button type="submit" className="confirm-btn">CONFIRM ADDITION</button>
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