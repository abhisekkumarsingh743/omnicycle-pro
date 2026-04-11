import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

const API = process.env.REACT_APP_API_URL;

function App() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('icms_user')));
    const [inventory, setInventory] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [activeTab, setActiveTab] = useState('inventory');
    const [newItem, setNewItem] = useState({ name: '', category: '', stock: '' });
    const [credentials, setCredentials] = useState({ email: '', password: '' });

    // --- Optimized Data Fetching ---
    const fetchData = useCallback(async () => {
        try {
            const invRes = await axios.get(`${API}/system/inventory`);
            setInventory(Array.isArray(invRes.data) ? invRes.data : []);
            
            const auditRes = await axios.get(`${API}/audit/logs`);
            setAuditLogs(Array.isArray(auditRes.data) ? auditRes.data : []);
        } catch (err) { 
            console.error("System Fetch Error", err); 
        }
    }, []);

    useEffect(() => { if (user) fetchData(); }, [user, fetchData]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API}/auth/login`, credentials);
            localStorage.setItem('icms_user', JSON.stringify(res.data));
            setUser(res.data);
        } catch (err) { alert("Invalid Credentials"); }
    };

    const addItem = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API}/system/inventory`, newItem);
            setNewItem({ name: '', category: '', stock: '' });
            fetchData();
        } catch (err) { alert("Add failed"); }
    };

    const deleteItem = async (id) => {
        if (window.confirm("Confirm Delete?")) {
            try {
                await axios.delete(`${API}/system/inventory/${id}`);
                fetchData();
            } catch (err) { alert("Delete failed"); }
        }
    };

    if (!user) {
        return (
            <div className="login-page">
                <form onSubmit={handleLogin} className="login-card">
                    <h2>OMNICYCLE LOGIN</h2>
                    <input type="email" placeholder="Email" onChange={e => setCredentials({...credentials, email: e.target.value})} required />
                    <input type="password" placeholder="Password" onChange={e => setCredentials({...credentials, password: e.target.value})} required />
                    <button type="submit">Initialize Session</button>
                </form>
            </div>
        );
    }

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div className="brand">OMNICYCLE PRO</div>
                <nav className="nav-menu">
                    <button className={activeTab === 'inventory' ? 'active' : ''} onClick={() => setActiveTab('inventory')}>📦 Inventory</button>
                    <button className={activeTab === 'audit' ? 'active' : ''} onClick={() => setActiveTab('audit')}>📜 Audit Trail</button>
                    <button className={activeTab === 'reports' ? 'active' : ''} onClick={() => setActiveTab('reports')}>📊 Reports</button>
                    <button className={activeTab === 'master' ? 'active' : ''} onClick={() => setActiveTab('master')}>📁 Master Data</button>
                </nav>
                <div className="sidebar-footer">
                    <div className="user-badge">
                        <small>ADMIN SESSION</small>
                        <p>Abhishek Singh</p>
                    </div>
                    <button className="logout-btn" onClick={() => {localStorage.removeItem('icms_user'); setUser(null);}}>Terminate Session</button>
                </div>
            </aside>

            <main className="main-content">
                <header className="content-header">
                    <h1>{activeTab.toUpperCase()} MANAGEMENT</h1>
                    <div className="header-tools">
                        <button className="tool-btn">📄 Export PDF</button>
                        <button className="tool-btn">📧 Send Mail</button>
                        <span className="live-tag">● LIVE_SYSTEM</span>
                    </div>
                </header>

                <div className="view-scroll-area">
                    {activeTab === 'inventory' && (
                        <>
                            <form onSubmit={addItem} className="inventory-form">
                                <input placeholder="Item Name" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} required />
                                <input placeholder="Category" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} required />
                                <input type="number" placeholder="Stock" value={newItem.stock} onChange={e => setNewItem({...newItem, stock: e.target.value})} required />
                                <button type="submit" className="primary-btn">+ Add Item</button>
                            </form>
                            <div className="glass-panel">
                                <table className="data-table">
                                    <thead>
                                        <tr><th>NAME</th><th>CATEGORY</th><th>STOCK</th><th>ACTION</th></tr>
                                    </thead>
                                    <tbody>
                                        {inventory.length > 0 ? inventory.map(item => (
                                            <tr key={item.id}>
                                                <td>{item.name}</td>
                                                <td>{item.category}</td>
                                                <td className="stock-val">{item.stock}</td>
                                                <td><button onClick={() => deleteItem(item.id)} className="del-icon">🗑️</button></td>
                                            </tr>
                                        )) : <tr><td colSpan="4" className="empty-row">No inventory items found.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {activeTab === 'audit' && (
                        <div className="glass-panel">
                            <table className="data-table">
                                <thead><tr><th>LOG_ID</th><th>USER</th><th>ACTION</th><th>TIMESTAMP</th></tr></thead>
                                <tbody>
                                    {auditLogs.length > 0 ? auditLogs.map(log => (
                                        <tr key={log.id}>
                                            <td>{log.id}</td>
                                            <td>{log.user}</td>
                                            <td>{log.action}</td>
                                            <td className="time-col">{log.timestamp}</td>
                                        </tr>
                                    )) : <tr><td colSpan="4" className="empty-row">No audit history recorded.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {(activeTab === 'reports' || activeTab === 'master') && (
                        <div className="glass-panel centered-msg">
                            <p>System is generating data for {activeTab}...</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default App;