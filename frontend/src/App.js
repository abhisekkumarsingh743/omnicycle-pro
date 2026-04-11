import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

const API = process.env.REACT_APP_API_URL;

function App() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('icms_user')));
    const [inventory, setInventory] = useState(JSON.parse(localStorage.getItem('cache_inv')) || []);
    const [activeTab, setActiveTab] = useState('inventory');
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const res = await axios.get(`${API}/system/inventory`);
            setInventory(res.data);
            localStorage.setItem('cache_inv', JSON.stringify(res.data));
        } catch (e) { console.warn("Using Cached Data"); }
        setLoading(false);
    }, [user]);

    useEffect(() => { fetchData(); }, [fetchData]);

    // LOGIN RENDER (LOCK-CENTERED)
    if (!user) {
        return (
            <div className="login-wrapper">
                <div className="login-box">
                    <h2>OMNICYCLE</h2>
                    <p>INDUSTRIAL CMS PRO</p>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const loggedUser = { name: "Abhishek Singh", id: "OP_743" };
                        localStorage.setItem('icms_user', JSON.stringify(loggedUser));
                        setUser(loggedUser);
                    }}>
                        <input className="input-field" type="email" placeholder="Terminal ID" required />
                        <input className="input-field" type="password" placeholder="Access Key" required />
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
                    <button className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>📊 Reports</button>
                    <button className={`nav-item ${activeTab === 'master' ? 'active' : ''}`} onClick={() => setActiveTab('master')}>📁 Master Data</button>
                </nav>
                <div className="side-footer">
                    <p className="op-id">OPERATOR_SESSION</p>
                    <p className="op-name">Abhishek Singh</p>
                    <button className="term-btn" onClick={() => { localStorage.clear(); window.location.reload(); }}>TERMINATE SESSION</button>
                </div>
            </aside>

            <main className="workspace">
                <header className="work-header">
                    <h1>{activeTab.toUpperCase()}</h1>
                    <div className="top-tools">
                        <button className="btn-util">📄 Export PDF</button>
                        <button className="btn-util">📧 Send Mail</button>
                        <span className="sys-status" style={{color: loading ? '#f1c40f' : '#2ecc71'}}>
                            {loading ? "● SYNCING" : "● SYSTEM_READY"}
                        </span>
                    </div>
                </header>

                <div className="view-container">
                    {activeTab === 'inventory' && (
                        <>
                            <div className="entry-bar">
                                <input placeholder="Item Name" />
                                <input placeholder="Category" />
                                <input type="number" placeholder="Stock" />
                                <button className="btn-add">ADD ITEM</button>
                            </div>
                            <div className="table-container">
                                <table className="data-grid">
                                    <thead><tr><th>NAME</th><th>CATEGORY</th><th>STOCK</th><th>ACTION</th></tr></thead>
                                    <tbody>
                                        {inventory.map((item, i) => (
                                            <tr key={i}><td>{item.name}</td><td>{item.category}</td><td style={{color: '#fff'}}>{item.stock}</td><td><button style={{background:'none', border:'none', cursor:'pointer'}}>🗑️</button></td></tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
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
                            <div className="card-glass"><h4>Active Warehouses</h4><p>04</p></div>
                            <div className="card-glass"><h4>Connected Nodes</h4><p>12</p></div>
                            <div className="card-glass"><h4>System Uptime</h4><p>99.9%</p></div>
                            <div className="card-glass" style={{gridColumn: 'span 3', marginTop: '10px'}}>
                                <h4>System Analytics</h4>
                                <p style={{fontSize: '14px', color: '#666', marginTop: '10px'}}>Master node initialized. All background services (Auth, Inventory, Audit) are operational.</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default App;