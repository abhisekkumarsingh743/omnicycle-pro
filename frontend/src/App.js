import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

function App() {
  const [data, setData] = useState({ inventory: [] });
  const [activeTab, setActiveTab] = useState('inventory');
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', category: '', stock: '', status: 'Active' });

  useEffect(() => { if (isLoggedIn) fetchData(); }, [isLoggedIn]);

  const fetchData = () => {
    axios.get(`${API_BASE}/all-data`).then(res => setData(res.data)).catch(console.error);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/add-item`, newItem);
      setShowAddForm(false);
      fetchData();
    } catch (e) { alert("Backend Error"); }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/delete-item/${id}`);
      fetchData();
    } catch (e) { alert("Delete Error"); }
  };

  if (!isLoggedIn) return (
    <div className="login-page">
      <div className="glass-login">
        <h2>OMNICYCLE LOGIN</h2>
        <button className="gold-btn" onClick={() => { localStorage.setItem('isLoggedIn', 'true'); setIsLoggedIn(true); }}>
          INITIALIZE AS ADMIN
        </button>
      </div>
    </div>
  );

  return (
    <div className="app-layout">
      <aside className="vertical-nav">
        <h1 className="brand">OMNICYCLE</h1>
        
        <div className="nav-group">
          <p className="nav-label">MONITORING</p>
          <button className={activeTab === 'inventory' ? 'v-btn active' : 'v-btn'} onClick={() => setActiveTab('inventory')}>📦 INVENTORY</button>
          <button className={activeTab === 'reports' ? 'v-btn active' : 'v-btn'} onClick={() => setActiveTab('reports')}>📈 REPORTS</button>
          
          <p className="nav-label">ACTIONS</p>
          <button className="v-btn action" onClick={() => setShowAddForm(true)}>➕ ADD NODE</button>
          <button className="v-btn pdf">📄 EXPORT PDF</button>
          <button className="v-btn mail">📧 SEND MAIL</button>
        </div>

        <div className="user-profile">
          <div className="avatar">AS</div>
          <div className="info">
            <p className="u-name">Abhishek Singh</p>
            <p className="u-role">ADMIN_ACCESS</p>
          </div>
          <button className="term-btn" onClick={() => { localStorage.clear(); setIsLoggedIn(false); }}>TERMINATE</button>
        </div>
      </aside>

      <main className="main-viewport">
        {showAddForm && (
          <div className="modal-overlay">
            <form className="glass-form" onSubmit={handleAdd}>
              <h3>REGISTER NEW NODE</h3>
              <input placeholder="Asset Name" onChange={e => setNewItem({...newItem, name: e.target.value})} required />
              <input placeholder="Category" onChange={e => setNewItem({...newItem, category: e.target.value})} required />
              <input type="number" placeholder="Stock" onChange={e => setNewItem({...newItem, stock: e.target.value})} required />
              <div className="form-btns">
                <button type="submit" className="gold-btn">CONFIRM</button>
                <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>CANCEL</button>
              </div>
            </form>
          </div>
        )}

        <div className="content-box">
          <h2>{activeTab.toUpperCase()} DATA</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr><th>REF_ID</th><th>NAME</th><th>QTY</th><th>STATUS</th><th>OP</th></tr>
              </thead>
              <tbody>
                {data.inventory.map(item => (
                  <tr key={item.id}>
                    <td>{item.id}</td><td>{item.name}</td><td>{item.stock}</td>
                    <td><span className={`status ${item.status.toLowerCase()}`}>{item.status}</span></td>
                    <td><button onClick={() => handleDelete(item.id)} className="trash">🗑️</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
export default App;