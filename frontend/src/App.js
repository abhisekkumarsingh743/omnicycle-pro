import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API = "https://omnicycle-pro.onrender.com";

function App() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('icms_user')));
    const [tab, setTab] = useState('inventory');
    const [data, setData] = useState({ inventory: [], auditLogs: [], metrics: {} });
    const [loading, setLoading] = useState(false);
    const [login, setLogin] = useState({ email: '', password: '' });

    useEffect(() => {
        if (!user) return;
        const fetchAll = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API}/all-data`);
                setData(res.data);
            } catch (e) { console.error("Sync Error - API Offline"); }
            setLoading(false);
        };
        fetchAll();
    }, [user, tab]);

    const handleLogin = (e) => {
        e.preventDefault();
        const session = { name: "Abhishek Singh", role: "ADMIN_PRO" };
        localStorage.setItem('icms_user', JSON.stringify(session));
        setUser(session);
    };

    if (!user) return (
        <div className="login-screen">
            <div className="login-card">
                <h2 style={{color: 'var(--gold)', letterSpacing: '3px'}}>OMNICYCLE</h2>
                <p style={{fontSize: '10px', color: '#444', marginBottom: '25px'}}>INDUSTRIAL TERMINAL V2</p>
                <form onSubmit={handleLogin}>
                    <input className="login-input" type="email" placeholder="Terminal ID" required onChange={e => setLogin({...login, email: e.target.value})} />
                    <input className="login-input" type="password" placeholder="Access Password" required onChange={e => setLogin({...login, password: e.target.value})} />
                    <button type="submit" className="btn-gold" style={{width: '100%'}}>INITIALIZE SESSION</button>
                </form>
            </div>
        </div>
    );

    return (
        <div className="app-container">
            <aside className="sidebar">
                <h3 style={{color: 'var(--gold)', marginBottom: '40px'}}>OMNICYCLE PRO</h3>
                <nav style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '5px'}}>
                    <button className={`btn-outline ${tab === 'inventory' ? 'active' : ''}`} style={{marginLeft:0, textAlign:'left'}} onClick={() => setTab('inventory')}>📦 Inventory</button>
                    <button className={`btn-outline ${tab === 'audit' ? 'active' : ''}`} style={{marginLeft:0, textAlign:'left'}} onClick={() => setTab('audit')}>📜 Audit Trail</button>
                    <button className={`btn-outline ${tab === 'reports' ? 'active' : ''}`} style={{marginLeft:0, textAlign:'left'}} onClick={() => setTab('reports')}>📊 Reports</button>
                </nav>
                <div style={{borderTop: '1px solid #111', paddingTop: '20px'}}>
                    <p style={{fontSize: '11px', color: '#555', margin: 0}}>{user.role}</p>
                    <p style={{fontWeight: 'bold', margin: '5px 0 15px 0'}}>{user.name}</p>
                    <button onClick={() => {localStorage.clear(); window.location.reload();}} className="btn-outline" style={{width: '100%', marginLeft: 0, color: '#ff4d4d'}}>Terminate</button>
                </div>
            </aside>

            <main className="main-stage">
                <header className="work-header">
                    <h2 style={{margin: 0, color: '#fff'}}>{tab.toUpperCase()}</h2>
                    <div>
                        <button className="btn-outline">📄 PDF</button>
                        <button className="btn-outline">📧 Mail</button>
                        <span style={{color: loading ? '#f1c40f' : '#2ecc71', fontSize: '10px', marginLeft: '15px'}}>● {loading ? 'SYNCING' : 'LIVE'}</span>
                    </div>
                </header>

                <div className="data-table-container">
                    {tab === 'inventory' && (
                        <table className="data-table">
                            <thead><tr><th>ID</th><th>ITEM NAME</th><th>CATEGORY</th><th>STOCK</th><th>STATUS</th></tr></thead>
                            <tbody>
                                {data.inventory.map((item, i) => (
                                    <tr key={i}><td>{item.id}</td><td>{item.name}</td><td>{item.category}</td><td style={{color: '#fff', fontWeight:'bold'}}>{item.stock}</td><td>{item.status}</td></tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {tab === 'audit' && (
                        <table className="data-table">
                            <thead><tr><th>ID</th><th>EVENT</th><th>OPERATOR</th><th>TIMESTAMP</th></tr></thead>
                            <tbody>
                                {data.auditLogs.map((log, i) => (
                                    <tr key={i}><td>{log.id}</td><td>{log.event}</td><td>{log.user}</td><td>{log.timestamp}</td></tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {tab === 'reports' && (
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px'}}>
                            <div className="login-card" style={{width: 'auto'}}><h4>Efficiency</h4><p style={{fontSize: '28px', color: '#fff'}}>98.4%</p></div>
                            <div className="login-card" style={{width: 'auto'}}><h4>Nodes</h4><p style={{fontSize: '28px', color: '#fff'}}>12</p></div>
                            <div className="login-card" style={{width: 'auto'}}><h4>Health</h4><p style={{fontSize: '28px', color: '#2ecc71'}}>Good</p></div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default App;