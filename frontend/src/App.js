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
      setData(res.data);
    } catch (err) { console.error("Fetch error"); }
  };

  // --- PDF Export Logic ---
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("OMNICYCLE PRO - SYSTEM REPORT", 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    const tableColumn = ["REF_ID", "NAME", "CATEGORY", "QUANTITY", "STATUS"];
    const tableRows = data.inventory.map(item => [
      item.id, item.name, item.category, item.stock, item.status
    ]);

    doc.autoTable({
      startY: 40,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [255, 215, 0], textColor: [0, 0, 0] }
    });

    doc.save(`Omnicycle_Report_${Date.now()}.pdf`);
  };

  // --- Send Mail Logic ---
  const sendEmail = () => {
    const email = prompt("Please enter the recipient's email address:");
    if (email) {
      alert(`Report generated and prepared for: ${email}\n(Note: Direct SMTP attachment requires a paid Backend Email Service like SendGrid/Nodemailer)`);
      // Simulating mail client opening
      window.location.href = `mailto:${email}?subject=Omnicycle%20System%20Report&body=Please%20find%20the%20attached%20system%20data%20summary.`;
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) return (
    <div className="login-wrapper">
      <div className="login-glass-card">
        <h1>OMNICYCLE PRO</h1>
        <form onSubmit={handleLogin}>
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
        </nav>
        <div className="nav-user">
          <p className="u-name">ABHISHEK SINGH</p>
          <button className="logout-action" onClick={() => { localStorage.clear(); setIsLoggedIn(false); }}>TERMINATE SESSION</button>
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
                <h3>Asset Inventory</h3>
                <button className="prime-btn" onClick={() => setShowAddForm(true)}>+ ADD ITEM</button>
              </div>
              <table>
                <thead>
                  <tr><th>REF_ID</th><th>NAME</th><th>QTY</th><th>STATUS</th></tr>
                </thead>
                <tbody>
                  {data.inventory.map(item => (
                    <tr key={item.id}>
                      <td className="mono">{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.stock}</td>
                      <td><span className={`badge ${item.status.toLowerCase()}`}>{item.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="table-wrapper">
              <h3>System Metrics</h3>
              <table>
                <thead>
                  <tr><th>METRIC</th><th>VALUE</th><th>STATUS</th></tr>
                </thead>
                <tbody>
                  <tr><td>System Efficiency</td><td>98.4%</td><td className="green">OPTIMAL</td></tr>
                  <tr><td>Database Health</td><td>100%</td><td className="green">STABLE</td></tr>
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
               setShowAddForm(false);
               fetchData();
            }}>
              <h3>REGISTER ASSET</h3>
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