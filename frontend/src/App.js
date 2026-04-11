import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

const API = process.env.REACT_APP_API_URL;

function App() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('icms_user')));
    const [inventory, setInventory] = useState(JSON.parse(localStorage.getItem('cache_inv')) || []);
    const [auditLogs, setAuditLogs] = useState(JSON.parse(localStorage.getItem('cache_audit')) || []);
    const [activeTab, setActiveTab] = useState('inventory');
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ name: '', category: '', stock: '' });

    const fetchData = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const [inv, aud] = await Promise.all([
                axios.get(`${API}/system/inventory`),
                axios.get(`${API}/audit/logs`)
            ]);
            setInventory(inv.data);
            setAuditLogs(aud.data);
            localStorage.setItem('cache_inv', JSON.stringify(inv.data));
            localStorage.setItem('cache_audit', JSON.stringify(aud.data));
        } catch (e) { console.error("Sync Error"); }
        setLoading(false);
    }, [user]);

    useEffect(() => { fetchData(); }, [fetchData]);

    if (!user) {
        return (
            <div className="login-page">
                <form className="login-card" onSubmit={(e) => {
                    e.preventDefault();
                    const dummyUser = { name: "Abhishek Singh", role: "Admin" };
                    localStorage.setItem('icms_user', JSON.stringify(dummyUser));
                    setUser(dummyUser);
                }}>
                    <div className="login-header">
                        <h2>OMNICYCLE</h2>
                        <small>INDUSTRIAL CMS PRO</small>
                    </div>
                    <div className="input-group">
                        <input type="email" placeholder="Terminal ID" required />
                        <input type="password" placeholder="Access Key" required />
                    </div>
                    <button type="submit" className="login-btn">INITIALIZE SESSION</button>
                </form>
            </div>
        );
    }

    return (
        <div className="app-layout">
            <aside className="sidebar">
                <div className="brand">OMNICYCLE PRO</div>
                <div className="nav-group">
                    <button className={`nav-btn ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>📦 Inventory</button>
                    <button className={`nav-btn ${activeTab === 'audit' ? 'active' : ''}`} onClick={() => setActiveTab('audit')}>📜 Audit Trail</button>
                    <button className={`nav-btn ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>📊 Reports</button>
                    <button className={`nav-btn ${activeTab === 'master' ? 'active' : ''}`} onClick={() => setActiveTab('master')}>📁 Master Data</button>
                </div>
                <div className="sidebar-footer">
                    <div className="user-box">
                        <small>OPERATOR_SESSION</small>
                        <p>Abhishek Singh</p>
                    </div>
                    <button className="terminate-btn" onClick={() => { localStorage.clear(); window.location.reload(); }}>TERMINATE SESSION</button>
                </div>
            </aside>

            <main className="main-content">
                <header>
                    <h1>{activeTab.toUpperCase()}</h1>
                    <div className="header-tools">
                        <button className="action-btn">📄 Export PDF</button>
                        <button className="action-btn">📧 Send Mail</button>
                        <span className={`status-tag ${loading ? 'busy' : 'ready'}`}>
                            {loading ? "● SYNCING" : "● SYSTEM_READY"}
                        </span>
                    </div>
                </header>

                <div className="view-port">
                    {activeTab === 'inventory' && (
                        <>
                            <div className="inventory-controls">
                                <input placeholder="Item Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                                <input placeholder="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
                                <input type="number" placeholder="Stock" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} />
                                <button className="add-btn" onClick={fetchData}>ADD ITEM</button>
                            </div>
                            <div className="glass-table-wrapper">
                                <table className="custom-table">
                                    <thead><tr><th>NAME</th><th>CATEGORY</th><th>STOCK</th><th>ACTION</th></tr></thead>
                                    <tbody>
                                        {inventory.map((item, i) => (
                                            <tr key={i}><td>{item.name}</td><td>{item.category}</td><td style={{color: '#fff'}}>{item.stock}</td><td><button className="del-icon">🗑️</button></td></tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {activeTab === 'reports' && (
                        <div className="reports-grid">
                            <div className="stat-card"><h3>Total Assets</h3><p>{inventory.length}</p></div>
                            <div className="stat-card"><h3>Low Stock</h3><p className="danger">{inventory.filter(i => i.stock < 10).length}</p></div>
                            <div className="stat-card"><h3>Efficiency</h3><p>98.4%</p></div>
                        </div>
                    )}

                    {activeTab === 'audit' && (
                        <div className="glass-table-wrapper">
                            <table className="custom-table">
                                <thead><tr><th>LOG_ID</th><th>ACTION</th><th>TIMESTAMP</th></tr></thead>
                                <tbody>
                                    {auditLogs.map((log, i) => (
                                        <tr key={i}><td>{log.id || `L-0${i}`}</td><td>{log.action}</td><td>{new Date().toLocaleTimeString()}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default App;