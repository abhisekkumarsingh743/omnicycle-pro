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
                axios.get(`${API}/system/inventory`).catch(() => ({ data: inventory })),
                axios.get(`${API}/audit/logs`).catch(() => ({ data: auditLogs }))
            ]);
            setInventory(inv.data);
            setAuditLogs(aud.data);
            localStorage.setItem('cache_inv', JSON.stringify(inv.data));
            localStorage.setItem('cache_audit', JSON.stringify(aud.data));
        } catch (e) { console.warn("Backend Link Error: Check Render Logs"); }
        setLoading(false);
    }, [user, inventory, auditLogs]);

    useEffect(() => { fetchData(); }, [fetchData]);

    if (!user) {
        return (
            <div className="login-wrapper">
                <div className="login-box">
                    <h2>OMNICYCLE</h2>
                    <p>INDUSTRIAL CMS PRO</p>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const loggedUser = { name: "Abhishek Singh" };
                        localStorage.setItem('icms_user', JSON.stringify(loggedUser));
                        setUser(loggedUser);
                    }}>
                        <input className="login-input" type="email" placeholder="Terminal ID" required />
                        <input className="login-input" type="password" placeholder="Access Key" required />
                        <button type="submit" className="login-submit">INITIALIZE SESSION</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <aside className="side-panel">
                <div className="brand-title">OMNICYCLE PRO</div>
                <nav className="nav-links">
                    <button className={`nav-item ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>📦 Inventory</button>
                    <button className={`nav-item ${activeTab === 'audit' ? 'active' : ''}`} onClick={() => setActiveTab('audit')}>📜 Audit Trail</button>
                    <button className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>📊 Reports</button>
                    <button className={`nav-item ${activeTab === 'master' ? 'active' : ''}`} onClick={() => setActiveTab('master')}>📁 Master Data</button>
                </nav>
                <div className="side-footer">
                    <div style={{fontSize: '10px', color: '#444', paddingLeft: '15px'}}>ADMIN_SESSION</div>
                    <p className="op-name">{user.name}</p>
                    <button className="term-btn" onClick={() => { localStorage.clear(); window.location.reload(); }}>TERMINATE SESSION</button>
                </div>
            </aside>

            <main className="workspace">
                <header className="work-header">
                    <h1 style={{color:'#fff', margin:0}}>{activeTab.toUpperCase()}</h1>
                    <div className="top-tools">
                        <span style={{color: loading ? '#f1c40f' : '#2ecc71', fontSize: '10px', fontWeight: 'bold'}}>
                            {loading ? "● SYNCING_GATEWAY" : "● SYSTEM_READY"}
                        </span>
                    </div>
                </header>

                <div className="view-port">
                    {activeTab === 'inventory' && (
                        <>
                            <div className="inventory-bar">
                                <input placeholder="Item Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                                <input placeholder="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
                                <input type="number" placeholder="Stock" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} />
                                <button className="btn-add" onClick={fetchData}>ADD ITEM</button>
                            </div>
                            <div className="table-container">
                                <table className="data-grid">
                                    <thead><tr><th>NAME</th><th>CATEGORY</th><th>STOCK</th><th>ACTION</th></tr></thead>
                                    <tbody>
                                        {inventory.length > 0 ? inventory.map((item, i) => (
                                            <tr key={i}><td>{item.name}</td><td>{item.category}</td><td style={{color: '#fff'}}>{item.stock}</td><td><button style={{background:'none', border:'none', cursor:'pointer'}}>🗑️</button></td></tr>
                                        )) : <tr><td colSpan="4" style={{textAlign:'center', padding:'20px'}}>No Inventory Data Found</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {activeTab === 'audit' && (
                        <div className="audit-log-box">
                            <pre>{JSON.stringify(auditLogs.length > 0 ? auditLogs : [{event: "Gateway Connection Initialized", timestamp: new Date()}], null, 4)}</pre>
                        </div>
                    )}

                    {activeTab === 'reports' && (
                        <div className="grid-3">
                            <div className="card-glass"><h4>Total Assets</h4><p>{inventory.length}</p></div>
                            <div className="card-glass"><h4>Low Stock</h4><p style={{color:'#e74c3c'}}>{inventory.filter(i => i.stock < 10).length}</p></div>
                            <div className="card-glass"><h4>Efficiency</h4><p>98.4%</p></div>
                        </div>
                    )}

                    {activeTab === 'master' && (
                        <div className="grid-3">
                            <div className="card-glass"><h4>Warehouses</h4><p>04</p></div>
                            <div className="card-glass"><h4>Nodes</h4><p>12</p></div>
                            <div className="card-glass"><h4>Uptime</h4><p>99.9%</p></div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default App;