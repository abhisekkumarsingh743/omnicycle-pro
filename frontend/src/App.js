import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API = process.env.REACT_APP_API_URL || "http://localhost:8000";

const App = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('icms_user')));
    const [tab, setTab] = useState('inventory');
    const [data, setData] = useState([]); // Default as empty array
    const [masterRaw, setMasterRaw] = useState(null);
    const [loading, setLoading] = useState(false);
    const [credentials, setCredentials] = useState({ email: '', password: '' });

    const isExplorer = window.location.pathname === '/backend-explorer';

    useEffect(() => {
        if (!user && !isExplorer) return;

        let endpoint = '';
        if (isExplorer || tab === 'system_monitor' || tab === 'reports') endpoint = '/system/all-data';
        else if (tab === 'inventory') endpoint = '/system/inventory-only';
        else if (tab === 'audit') endpoint = '/audit/logs';

        axios.get(`${API}${endpoint}`)
            .then(res => {
                if (tab === 'system_monitor' || isExplorer || tab === 'reports') {
                    setMasterRaw(res.data);
                    // Agar reports/master tab hai toh inventory array nikaal kar set karein
                    setData(res.data.inventory || []);
                } else {
                    setData(Array.isArray(res.data) ? res.data : []);
                }
            })
            .catch(() => setData([]));
    }, [tab, user, isExplorer]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API}/auth/login`, credentials);
            localStorage.setItem('icms_user', JSON.stringify(res.data));
            setUser(res.data);
        } catch (err) { alert("Invalid Credentials"); }
    };

    if (isExplorer) return (
        <div style={{background: '#000', color: '#4ade80', padding: '20px', minHeight: '100vh', fontFamily: 'monospace'}}>
            <h2>📂 CORE_BACKEND_EXPLORER_V1</h2>
            <hr border="1" color="#333" />
            <pre>{JSON.stringify(masterRaw, null, 4)}</pre>
        </div>
    );

    if (!user) return (
        <div className="auth-page">
            <div className="login-card">
                <h2>OMNICYCLE LOGIN</h2>
                <form onSubmit={handleLogin}>
                    <input className="login-input" type="email" placeholder="Email" onChange={e => setCredentials({...credentials, email: e.target.value})} required />
                    <input className="login-input" type="password" placeholder="Password" onChange={e => setCredentials({...credentials, password: e.target.value})} required />
                    <button className="primary-btn" type="submit">Initialize Session</button>
                </form>
            </div>
        </div>
    );

    return (
        <div className="dash-layout">
            <aside className="sidebar">
                <div onClick={() => setTab('inventory')} className={`nav-item ${tab === 'inventory' ? 'active' : ''}`}>📦 Inventory</div>
                <div onClick={() => setTab('audit')} className={`nav-item ${tab === 'audit' ? 'active' : ''}`}>📜 Audit Trail</div>
                <div onClick={() => setTab('reports')} className={`nav-item ${tab === 'reports' ? 'active' : ''}`}>📊 Reports</div>
                <div onClick={() => setTab('system_monitor')} className={`nav-item ${tab === 'system_monitor' ? 'active' : ''}`}>🖥️ Master Data</div>
                
                <div className="user-badge" style={{marginTop: 'auto', marginBottom: '10px'}}>
                    <div style={{fontSize: '11px', color: '#888'}}>{user.role} SESSION</div>
                    <div style={{fontWeight: 'bold'}}>{user.name}</div>
                </div>
                <button onClick={() => {localStorage.clear(); window.location.reload();}} className="logout-btn">Terminate Session</button>
            </aside>

            <main className="main-content">
                <header className="header">
                    <h1>{tab.toUpperCase()}</h1>
                    <div className="pulse">● LIVE_SYSTEM</div>
                </header>

                <div className="glass-card">
                    {tab === 'system_monitor' ? (
                        <div>
                            <h3>Tabular View</h3>
                            <table className="custom-table" style={{marginBottom: '20px'}}>
                                <thead><tr><th>Item</th><th>Status</th></tr></thead>
                                <tbody>
                                    {Array.isArray(data) && data.map((item, i) => (
                                        <tr key={i}><td>{item.name}</td><td>{item.status}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                            <h3>JSON Data</h3>
                            <pre style={{background: '#000', padding: '15px', color: '#4ade80', borderRadius: '8px', textAlign: 'left'}}>
                                {JSON.stringify(masterRaw, null, 4)}
                            </pre>
                        </div>
                    ) : (
                        <>
                            <table className="custom-table">
                                <thead><tr><th>Identifier</th><th>Description</th><th>Status/Time</th></tr></thead>
                                <tbody>
                                    {/* FIXED: Check if data is array before mapping */}
                                    {Array.isArray(data) && data.length > 0 ? data.map((item, i) => (
                                        <tr key={i}>
                                            <td>{item.id || item.user}</td>
                                            <td>{item.name || item.action}</td>
                                            <td>{item.status || new Date(item.timestamp).toLocaleTimeString()}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="3">No system data available.</td></tr>
                                    )}
                                </tbody>
                            </table>
                            {tab === 'reports' && (
                                <div style={{textAlign: 'center', marginTop: '30px'}}>
                                    <button onClick={() => alert("PDF Dispatched")} className="primary-btn" style={{width: 'auto', marginRight: '10px'}}>Export PDF</button>
                                    <button onClick={() => alert("Email Dispatched")} className="primary-btn" style={{width: 'auto', background: '#333'}}>Send Email</button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default App;