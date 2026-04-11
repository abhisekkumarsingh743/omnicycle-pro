import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API = "https://omnicycle-pro.onrender.com";

function App() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('session')));
    const [activeTab, setActiveTab] = useState('inventory');
    const [data, setData] = useState({ inventory: [], auditLogs: [], metrics: {} });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API}/all-data`);
                setData(res.data);
            } catch (e) { console.error("Link Error - Using Cache"); }
            setLoading(false);
        };
        fetchData();
    }, [user, activeTab]);

    const handleLogin = (e) => {
        e.preventDefault();
        const sessionUser = { name: "Abhishek Singh", role: "ADMIN" };
        localStorage.setItem('session', JSON.stringify(sessionUser));
        setUser(sessionUser);
    };

    if (!user) return (
        <div className="login-screen">
            <div className="login-card">
                <h2 style={{color: '#a18e0d', letterSpacing: '4px'}}>OMNICYCLE</h2>
                <p style={{fontSize: '10px', color: '#444', marginBottom: '30px'}}>INDUSTRIAL CMS PRO</p>
                <form onSubmit={handleLogin}>
                    <input className="login-input" type="text" placeholder="Terminal ID" required />
                    <button type="submit" className="btn-gold" style={{width: '100%'}}>INITIALIZE SESSION</button>
                </form>
            </div>
        </div>
    );

    return (
        <div className="dashboard">
            <aside className="sidebar">
                <div style={{color: '#a18e0d', fontWeight: '900', fontSize: '18px', marginBottom: '40px', paddingLeft: '10px'}}>OMNICYCLE PRO</div>
                <nav style={{flex: 1}}>
                    <button className={`nav-item ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>📦 Inventory</button>
                    <button className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>📊 Reports</button>
                    <button className={`nav-item ${activeTab === 'audit' ? 'active' : ''}`} onClick={() => setActiveTab('audit')}>📜 Audit Trail</button>
                    <button className={`nav-item ${activeTab === 'master' ? 'active' : ''}`} onClick={() => setActiveTab('master')}>📁 Master Data</button>
                </nav>
                <div style={{borderTop: '1px solid #111', paddingTop: '20px'}}>
                    <p style={{fontSize: '12px', color: '#999', margin: '0 0 5px 10px'}}>{user.role}</p>
                    <p style={{fontWeight: 'bold', margin: '0 0 15px 10px'}}>{user.name}</p>
                    <button onClick={() => {localStorage.clear(); window.location.reload();}} className="btn-outline" style={{width: '100%', marginLeft: 0, color: '#ff4d4d'}}>Terminate Session</button>
                </div>
            </aside>

            <main className="workspace">
                <header className="header">
                    <h2 style={{margin: 0, color: '#fff'}}>{activeTab.toUpperCase()}</h2>
                    <div>
                        <button className="btn-outline">📄 Export PDF</button>
                        <button className="btn-outline">📧 Send Mail</button>
                        <span style={{color: loading ? '#f1c40f' : '#2ecc71', fontSize: '10px', marginLeft: '15px'}}>● {loading ? 'SYNCING' : 'LIVE'}</span>
                    </div>
                </header>

                <div className="content">
                    {activeTab === 'inventory' && (
                        <div className="grid-3">
                            <div className="card" style={{gridColumn: 'span 3'}}>
                                <h4>Active Inventory</h4>
                                <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '20px'}}>
                                    <thead><tr style={{color: '#a18e0d', fontSize: '11px', textAlign: 'left'}}><th style={{padding: '10px'}}>ITEM</th><th>CATEGORY</th><th>STOCK</th></tr></thead>
                                    <tbody>
                                        {data.inventory.map((item, i) => (
                                            <tr key={i} style={{borderTop: '1px solid #111'}}><td style={{padding: '12px'}}>{item.name}</td><td>{item.category}</td><td style={{color: '#fff'}}>{item.stock}</td></tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'reports' && (
                        <div className="grid-3">
                            <div className="card"><h4>Efficiency</h4><p>98.4%</p></div>
                            <div className="card"><h4>Anomalies</h4><p style={{color: '#2ecc71'}}>0</p></div>
                            <div className="card"><h4>Health</h4><p>Good</p></div>
                        </div>
                    )}

                    {activeTab === 'audit' && (
                        <div style={{padding: '30px'}}>
                            <div className="audit-pre"><pre>{JSON.stringify(data.auditLogs, null, 4)}</pre></div>
                        </div>
                    )}

                    {activeTab === 'master' && (
                        <div className="grid-3">
                            <div className="card"><h4>Warehouses</h4><p>{data.metrics?.warehouses || 4}</p></div>
                            <div className="card"><h4>Nodes</h4><p>{data.metrics?.nodes || 12}</p></div>
                            <div className="card"><h4>Uptime</h4><p>{data.metrics?.uptime || '99.9%'}</p></div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default App;