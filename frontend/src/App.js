import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API = "https://omnicycle-pro.onrender.com";

function App() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('session')));
    const [tab, setTab] = useState('inventory');
    const [data, setData] = useState({ inventory: [], auditLogs: [], metrics: {} });
    const [loading, setLoading] = useState(false);
    const [creds, setCreds] = useState({ email: '', password: '' });

    // Data Fetching Logic
    useEffect(() => {
        if (!user) return;
        const sync = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API}/all-data`);
                setData(res.data);
            } catch (e) { 
                console.error("Backend unreachable, using placeholder data.");
                setData({
                    inventory: [{name: "Offline Mode", category: "N/A", stock: 0}],
                    auditLogs: [{event: "Connection Error", status: "Fail", timestamp: new Date()}],
                    metrics: {warehouses: 0, nodes: 0, uptime: "0%"}
                });
            }
            setLoading(false);
        };
        sync();
    }, [user, tab]);

    const handleLogin = (e) => {
        e.preventDefault();
        // Simple validation for demo
        if(creds.email && creds.password) {
            const sessionData = { name: "Abhishek Singh", role: "Super Admin" };
            localStorage.setItem('session', JSON.stringify(sessionData));
            setUser(sessionData);
        }
    };

    if (!user) return (
        <div className="login-screen">
            <div className="login-card">
                <h2 style={{color: 'var(--gold)', letterSpacing: '4px', margin: 0}}>OMNICYCLE</h2>
                <p style={{fontSize: '10px', color: '#444', marginBottom: '30px'}}>INDUSTRIAL CMS PRO</p>
                <form onSubmit={handleLogin}>
                    <input type="email" placeholder="Terminal ID (Email)" required 
                        onChange={e => setCreds({...creds, email: e.target.value})} />
                    <input type="password" placeholder="Access Password" required 
                        onChange={e => setCreds({...creds, password: e.target.value})} />
                    <button type="submit" className="btn-gold" style={{width: '100%'}}>INITIALIZE SESSION</button>
                </form>
            </div>
        </div>
    );

    return (
        <div className="app-shell">
            <aside className="sidebar">
                <div style={{color: 'var(--gold)', fontWeight: '900', fontSize: '18px', marginBottom: '40px'}}>OMNICYCLE PRO</div>
                <nav style={{flex: 1}}>
                    <button className={`nav-item ${tab === 'inventory' ? 'active' : ''}`} onClick={() => setTab('inventory')}>📦 Inventory</button>
                    <button className={`nav-item ${tab === 'reports' ? 'active' : ''}`} onClick={() => setTab('reports')}>📊 Reports</button>
                    <button className={`nav-item ${tab === 'audit' ? 'active' : ''}`} onClick={() => setTab('audit')}>📜 Audit Trail</button>
                    <button className={`nav-item ${tab === 'master' ? 'active' : ''}`} onClick={() => setTab('master')}>📁 Master Data</button>
                </nav>
                <div style={{borderTop: '1px solid #222', paddingTop: '20px'}}>
                    <p style={{fontSize: '11px', color: '#666', margin: 0}}>{user.role}</p>
                    <p style={{fontWeight: 'bold', margin: '5px 0 15px 0'}}>{user.name}</p>
                    <button onClick={() => {localStorage.clear(); window.location.reload();}} className="btn-outline" style={{width: '100%', marginLeft: 0, color: '#ff4d4d'}}>Terminate Session</button>
                </div>
            </aside>

            <main className="main-view">
                <header className="header">
                    <h2 style={{margin: 0, textTransform: 'uppercase'}}>{tab} Management</h2>
                    <div>
                        <button className="btn-outline">📄 Export PDF</button>
                        <button className="btn-outline">📧 Send Mail</button>
                        <span style={{color: loading ? '#f1c40f' : '#2ecc71', fontSize: '10px', marginLeft: '20px'}}>
                            ● {loading ? 'SYNCING' : 'LIVE'}
                        </span>
                    </div>
                </header>

                <div className="content">
                    {tab === 'inventory' && (
                        <div style={{padding: '40px'}}>
                            <div className="card" style={{width: '100%'}}>
                                <h4>Active Stock</h4>
                                <table>
                                    <thead><tr><th>ITEM NAME</th><th>CATEGORY</th><th>CURRENT STOCK</th></tr></thead>
                                    <tbody>
                                        {data.inventory.map((item, i) => (
                                            <tr key={i}><td>{item.name}</td><td>{item.category}</td><td style={{color: '#fff', fontWeight: 'bold'}}>{item.stock}</td></tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {tab === 'reports' && (
                        <div className="grid-3">
                            <div className="card"><h4>Efficiency</h4><p>98.4%</p></div>
                            <div className="card"><h4>Weekly Logs</h4><p>158</p></div>
                            <div className="card"><h4>System Health</h4><p style={{color: '#2ecc71'}}>Optimum</p></div>
                        </div>
                    )}

                    {tab === 'audit' && (
                        <div style={{padding: '40px'}}>
                            <div className="card" style={{fontFamily: 'monospace', fontSize: '12px', color: '#00ff00'}}>
                                <pre>{JSON.stringify(data.auditLogs, null, 4)}</pre>
                            </div>
                        </div>
                    )}

                    {tab === 'master' && (
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