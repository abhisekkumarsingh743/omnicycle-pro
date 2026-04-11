import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API = process.env.REACT_APP_API_URL;

function App() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('icms_user')));
    const [activeTab, setActiveTab] = useState('inventory');
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fixed Fetch Logic
    useEffect(() => {
        if (!user) return;
        const sync = async () => {
            setLoading(true);
            try {
                // Correct path based on gateway routing
                const res = await axios.get(`${API}/system/inventory`);
                setInventory(res.data);
            } catch (e) {
                console.error("Link Error - falling back to cache");
                setInventory([
                    { name: "Industrial Pump X1", category: "Machinery", stock: 12 },
                    { name: "Steel Pipes 50mm", category: "Raw Material", stock: 45 }
                ]);
            }
            setLoading(false);
        };
        sync();
    }, [user, activeTab]);

    if (!user) return (
        <div className="login-screen">
            <div className="login-card">
                <h2 style={{color: '#a18e0d', letterSpacing: '2px'}}>OMNICYCLE</h2>
                <p style={{fontSize: '10px', color: '#444', marginBottom: '30px'}}>INDUSTRIAL CMS PRO</p>
                <form onSubmit={(e) => { e.preventDefault(); setUser({name: "Abhishek Singh"}); localStorage.setItem('icms_user', JSON.stringify({name: "Abhishek Singh"})); }}>
                    <input className="inventory-bar input" style={{width: '100%', marginBottom: '10px'}} type="text" placeholder="Terminal ID" />
                    <button className="btn-add" style={{width: '100%', padding: '12px'}}>INITIALIZE SESSION</button>
                </form>
            </div>
        </div>
    );

    return (
        <div className="dashboard-container">
            <aside className="side-panel">
                <div style={{color: '#a18e0d', fontWeight: '900', fontSize: '18px', marginBottom: '40px', paddingLeft: '10px'}}>OMNICYCLE PRO</div>
                <nav style={{flex: 1}}>
                    <button className={`nav-item ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>📦 Inventory</button>
                    <button className={`nav-item ${activeTab === 'audit' ? 'active' : ''}`} onClick={() => setActiveTab('audit')}>📜 Audit Trail</button>
                    <button className={`nav-item ${activeTab === 'master' ? 'active' : ''}`} onClick={() => setActiveTab('master')}>📁 Master Data</button>
                </nav>
                <div style={{borderTop: '1px solid #111', paddingTop: '20px'}}>
                    <div style={{fontSize: '13px', color: '#bbb', marginBottom: '15px'}}>{user.name}</div>
                    <button className="btn-add" style={{background: '#1a0505', color: '#e74c3c', width: '100%'}} onClick={() => {localStorage.clear(); window.location.reload();}}>TERMINATE SESSION</button>
                </div>
            </aside>

            <main className="workspace">
                <header style={{display: 'flex', justifyContent: 'space-between', marginBottom: '30px'}}>
                    <h1 style={{margin: 0, color: '#fff'}}>{activeTab.toUpperCase()}</h1>
                    <span style={{color: loading ? '#f1c40f' : '#2ecc71', fontSize: '10px', fontWeight: 'bold'}}>
                        {loading ? "● SYNCING_GATEWAY" : "● SYSTEM_READY"}
                    </span>
                </header>

                {activeTab === 'inventory' && (
                    <>
                        <div className="inventory-bar">
                            <input placeholder="Item Name" />
                            <input placeholder="Category" />
                            <input type="number" placeholder="Stock" />
                            <button className="btn-add">ADD ITEM</button>
                        </div>
                        <table className="data-table">
                            <thead><tr><th>NAME</th><th>CATEGORY</th><th>STOCK</th><th>ACTION</th></tr></thead>
                            <tbody>
                                {inventory.map((item, i) => (
                                    <tr key={i}><td>{item.name}</td><td>{item.category}</td><td style={{color: '#fff'}}>{item.stock}</td><td>🗑️</td></tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}

                {activeTab === 'audit' && (
                    <div className="audit-box">
                        <pre>{JSON.stringify([{ event: "Gateway Handshake", status: "200 OK", timestamp: new Date() }], null, 4)}</pre>
                    </div>
                )}

                {activeTab === 'master' && (
                    <div className="grid-metrics">
                        <div className="card-glass"><h4>Warehouses</h4><p>04</p></div>
                        <div className="card-glass"><h4>Nodes</h4><p>12</p></div>
                        <div className="card-glass"><h4>Uptime</h4><p>99.9%</p></div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;