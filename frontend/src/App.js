import React, { useState } from 'react';
import './App.css';

function App() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('icms_user')));
    const [activeTab, setActiveTab] = useState('inventory');

    const auditLogs = [
        { id: "LOG-01", user: "Abhishek Singh", action: "System Auth", timestamp: "2026-04-11T04:48:57.339Z" }
    ];

    if (!user) {
        return (
            <div className="login-wrapper">
                <div className="login-box">
                    <h2 style={{color: '#a18e0d', letterSpacing: '4px'}}>OMNICYCLE</h2>
                    <p style={{fontSize: '10px', color: '#444'}}>INDUSTRIAL CMS PRO</p>
                    <button className="login-submit" style={{width: '100%', padding: '12px', background: '#a18e0d', border: 'none', marginTop: '20px'}} 
                        onClick={() => {
                            const u = { name: "Abhishek Singh" };
                            localStorage.setItem('icms_user', JSON.stringify(u));
                            setUser(u);
                        }}>INITIALIZE SESSION</button>
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
                    <p className="op-name">{user.name}</p>
                    <button className="term-btn" onClick={() => { localStorage.clear(); window.location.reload(); }}>TERMINATE SESSION</button>
                </div>
            </aside>

            <main className="workspace">
                <header className="work-header">
                    <h1 style={{color: '#fff'}}>{activeTab.toUpperCase()}</h1>
                    <div style={{color: '#2ecc71', fontSize: '10px'}}>● SYSTEM_READY</div>
                </header>

                {activeTab === 'inventory' && (
                    <div className="card-glass"><h4>Inventory Management</h4><p>Items Loaded</p></div>
                )}

                {activeTab === 'audit' && (
                    <div className="audit-container">
                        <pre className="log-entry">
                            {JSON.stringify(auditLogs, null, 4)}
                        </pre>
                    </div>
                )}

                {activeTab === 'reports' && (
                    <div className="grid-3">
                        <div className="card-glass"><h4>Efficiency</h4><p>98.4%</p></div>
                        <div className="card-glass"><h4>Uptime</h4><p>100%</p></div>
                    </div>
                )}

                {activeTab === 'master' && (
                    <div className="grid-3">
                        <div className="card-glass"><h4>Active Warehouses</h4><p>04</p></div>
                        <div className="card-glass"><h4>Connected Nodes</h4><p>12</p></div>
                        <div className="card-glass"><h4>System Uptime</h4><p>99.9%</p></div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;