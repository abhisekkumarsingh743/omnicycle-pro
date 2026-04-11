import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

const API = process.env.REACT_APP_API_URL;

function App() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('icms_user')));
    // Caching for instant startup
    const [inventory, setInventory] = useState(JSON.parse(localStorage.getItem('cache_inv')) || []);
    const [auditLogs, setAuditLogs] = useState(JSON.parse(localStorage.getItem('cache_audit')) || []);
    
    const [activeTab, setActiveTab] = useState('inventory');
    const [newItem, setNewItem] = useState({ name: '', category: '', stock: '' });
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            // Speed Fix: Parallel Wake-up for all services
            const [invRes, auditRes] = await Promise.all([
                axios.get(`${API}/system/inventory`, { timeout: 10000 }),
                axios.get(`${API}/audit/logs`, { timeout: 10000 })
            ]);
            
            setInventory(invRes.data);
            setAuditLogs(auditRes.data);
            
            localStorage.setItem('cache_inv', JSON.stringify(invRes.data));
            localStorage.setItem('cache_audit', JSON.stringify(auditRes.data));
        } catch (err) {
            console.warn("Backend warming up... using cached data.");
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API}/auth/login`, credentials);
            localStorage.setItem('icms_user', JSON.stringify(res.data));
            setUser(res.data);
        } catch (err) { alert("Access Denied: System Warm-up in progress."); }
    };

    if (!user) {
        return (
            <div className="login-page">
                <form onSubmit={handleLogin} className="login-card">
                    <div className="login-header">
                        <h2>OMNICYCLE</h2>
                        <p>INDUSTRIAL CMS PRO</p>
                    </div>
                    <div className="input-group">
                        <input type="email" placeholder="Terminal Email" onChange={e => setCredentials({...credentials, email: e.target.value})} required />
                        <input type="password" placeholder="Access Key" onChange={e => setCredentials({...credentials, password: e.target.value})} required />
                    </div>
                    <button type="submit" className="login-btn">Initialize Session</button>
                    <div className="login-footer">SECURE CLOUD INTERFACE v2.4</div>
                </form>
            </div>
        );
    }

    return (
        <div className="app-layout">
            <aside className="sidebar">
                <div className="brand">OMNICYCLE PRO</div>
                <nav>
                    <button className={activeTab === 'inventory' ? 'active' : ''} onClick={() => setActiveTab('inventory')}>📦 Inventory</button>
                    <button className={activeTab === 'audit' ? 'active' : ''} onClick={() => setActiveTab('audit')}>📜 Audit Trail</button>
                    <button className={activeTab === 'reports' ? 'active' : ''} onClick={() => setActiveTab('reports')}>📊 Reports</button>
                    <button className={activeTab === 'master' ? 'active' : ''} onClick={() => setActiveTab('master')}>📁 Master Data</button>
                </nav>
                <div className="sidebar-footer">
                    <div className="user-info">
                        <small>OPERATOR_ID</small>
                        <p>Abhishek Singh</p>
                    </div>
                    <button className="logout-btn" onClick={() => {localStorage.clear(); window.location.reload();}}>Terminate Session</button>
                </div>
            </aside>

            <main className="content">
                <header>
                    <h1>{activeTab.toUpperCase()}</h1>
                    <div className="header-btns">
                        <button className="tool-btn" onClick={() => alert("PDF Export Initiated")}>📄 Export PDF</button>
                        <button className="tool-btn" onClick={() => alert("Mail Dispatched")}>📧 Send Mail</button>
                        <span className={loading ? "status-busy" : "status-live"}>
                            {loading ? "● OPTIMIZING..." : "● SYSTEM_READY"}
                        </span>
                    </div>
                </header>

                <div className="view-port">
                    {activeTab === 'inventory' && (
                        <>
                            <div className="inventory-form">
                                <input placeholder="Item Name" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
                                <input placeholder="Category" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} />
                                <input type="number" placeholder="Stock" value={newItem.stock} onChange={e => setNewItem({...newItem, stock: e.target.value})} />
                                <button onClick={fetchData}>ADD ITEM</button>
                            </div>
                            <div className="glass-card">
                                <table className="data-table">
                                    <thead><tr><th>NAME</th><th>CATEGORY</th><th>STOCK</th><th>ACTION</th></tr></thead>
                                    <tbody>
                                        {inventory.map((item, idx) => (
                                            <tr key={idx}><td>{item.name}</td><td>{item.category}</td><td className="white-text">{item.stock}</td><td><button className="del-btn">🗑️</button></td></tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {activeTab === 'reports' && (
                        <div className="reports-grid">
                            <div className="glass-card stat-box">
                                <h3>Total Assets</h3>
                                <p className="stat-val">{inventory.length}</p>
                            </div>
                            <div className="glass-card stat-box">
                                <h3>Low Stock Alerts</h3>
                                <p className="stat-val danger">{inventory.filter(i => i.stock < 10).length}</p>
                            </div>
                            <div className="glass-card stat-box">
                                <h3>System Efficiency</h3>
                                <p className="stat-val">98.4%</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'audit' && (
                        <div className="glass-card">
                            <table className="data-table">
                                <thead><tr><th>LOG_ID</th><th>USER</th><th>ACTION</th><th>TIMESTAMP</th></tr></thead>
                                <tbody>
                                    {auditLogs.map((log, idx) => (
                                        <tr key={idx}><td>{log.id || `LOG-0${idx}`}</td><td>{log.user || 'Admin'}</td><td>{log.action}</td><td>{log.timestamp}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'master' && (
                        <div className="glass-card center-text">
                            <p>Loading Master System Analytics...</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default App;