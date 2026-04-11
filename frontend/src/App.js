import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API = "https://omnicycle-pro.onrender.com";

function App() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('icms_user')));
    const [activeTab, setActiveTab] = useState('inventory');
    const [data, setData] = useState({ inventory: [], auditLogs: [], metrics: {} });
    const [loading, setLoading] = useState(false);

    // Sync Data
    useEffect(() => {
        if (!user) return;
        const sync = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API}/all-data`);
                setData(res.data);
            } catch (e) { console.warn("Backend link error - Check Render Logs"); }
            setLoading(false);
        };
        sync();
    }, [user, activeTab]);

    if (!user) return (
        <div className="login-screen">
            <div className="login-card">
                <h2 style={{color: '#a18e0d', letterSpacing: '4px'}}>OMNICYCLE</h2>
                <p style={{fontSize: '10px', color: '#444', marginBottom: '30px'}}>ADMIN_ACCESS_REQUIRED</p>
                <button className="action-btn" style={{width: '100%', padding: '15px', background: '#a18e0d', color: '#000'}}
                    onClick={() => {
                        const u = { name: "Abhishek Singh", role: "Super Admin" };
                        localStorage.setItem('icms_user', JSON.stringify(u));
                        setUser(u);
                    }}>INITIALIZE SESSION</button>
            </div>
        </div>
    );

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div style={{color: '#a18e0d', fontWeight: '900', fontSize: '18px', marginBottom: '40px', paddingLeft: '10px'}}>OMNICYCLE PRO</div>
                <nav style={{flex: 1}}>
                    <button className={`nav-btn ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>📦 Inventory</button>
                    <button className={`nav-btn ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>📊 Reports</button>
                    <button className={`nav-btn ${activeTab === 'audit' ? 'active' : ''}`} onClick={() => setActiveTab('audit')}>📜 Audit Trail</button>
                    <button className={`nav-item ${activeTab === 'master' ? 'active' : ''}`} style={{background:'none', border:'none', width:'100%', textAlign:'left', padding:'12px', cursor:'pointer', color: activeTab==='master'?'#a18e0d':'#555'}} onClick={() => setActiveTab('master')}>📁 Master Data</button>
                </nav>
                <div style={{borderTop: '1px solid #111', paddingTop: '20px'}}>
                    <p style={{fontSize: '13px', color: '#bbb', margin: '0 0 5px 10px'}}>{user.name}</p>
                    <button onClick={() => {localStorage.clear(); window.location.reload();}} style={{color: '#e74c3c', fontSize: '11px', background: 'none', border: 'none', cursor: 'pointer', paddingLeft: '10px'}}>TERMINATE SESSION</button>
                </div>
            </aside>

            <main className="workspace">
                <header className="work-header">
                    <h2 style={{margin: 0, color: '#fff'}}>{activeTab.toUpperCase()}</h2>
                    <div className="header-actions">
                        <button className="action-btn">📄 Export PDF</button>
                        <button className="action-btn">📧 Send Mail</button>
                        <span style={{color: loading ? '#f1c40f' : '#2ecc71', fontSize: '10px', marginLeft: '15px'}}>● {loading ? 'SYNCING' : 'LIVE'}</span>
                    </div>
                </header>

                <div className="content-body">
                    {activeTab === 'inventory' && (
                        <div className="grid-3">
                            <div className="card-glass" style={{gridColumn: 'span 3'}}>
                                <h4>Inventory Table</h4>
                                <p style={{fontSize: '14px', color: '#666'}}>System initialized. {data.inventory?.length || 0} items found.</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'reports' && (
                        <div className="grid-3">
                            <div className="card-glass"><h4>Efficiency</h4><p>98.4%</p></div>
                            <div className="card-glass"><h4>Daily Reports</h4><p>24</p></div>
                            <div className="card-glass"><h4>Status</h4><p>Normal</p></div>
                        </div>
                    )}

                    {activeTab === 'audit' && (
                        <div style={{padding: '40px'}}>
                            <div className="card-glass" style={{fontFamily: 'monospace', color: '#00ff00', fontSize: '13px'}}>
                                <pre>{JSON.stringify(data.auditLogs, null, 4)}</pre>
                            </div>
                        </div>
                    )}

                    {activeTab === 'master' && (
                        <div className="grid-3">
                            <div className="card-glass"><h4>Warehouses</h4><p>{data.metrics?.warehouses || 0}</p></div>
                            <div className="card-glass"><h4>Nodes</h4><p>{data.metrics?.nodes || 0}</p></div>
                            <div className="card-glass"><h4>Uptime</h4><p>{data.metrics?.uptime || '0%'}</p></div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default App;