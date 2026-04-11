import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

const API = process.env.REACT_APP_API_URL;

function App() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('icms_user')));
    // Speed Fix: Caching data for instant load
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
            // Speed Fix: Parallel Fetching to wake up services faster
            const [invRes, auditRes] = await Promise.all([
                axios.get(`${API}/system/inventory`),
                axios.get(`${API}/audit/logs`)
            ]);
            
            setInventory(invRes.data);
            setAuditLogs(invRes.data); // Assuming same source for now
            
            localStorage.setItem('cache_inv', JSON.stringify(invRes.data));
            localStorage.setItem('cache_audit', JSON.stringify(auditRes.data));
        } catch (err) {
            console.error("System warming up...", err);
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
        } catch (err) { alert("Invalid Credentials or Service Warming Up"); }
    };

    // UI Fix: Proper Login Page Structure
    if (!user) {
        return (
            <div className="login-page">
                <form onSubmit={handleLogin} className="login-card">
                    <div className="login-header">
                        <h2>OMNICYCLE</h2>
                        <p>INDUSTRIAL CMS PRO</p>
                    </div>
                    <div className="input-group">
                        <input 
                            type="email" 
                            placeholder="Terminal Email" 
                            onChange={e => setCredentials({...credentials, email: e.target.value})} 
                            required 
                        />
                        <input 
                            type="password" 
                            placeholder="Access Key" 
                            onChange={e => setCredentials({...credentials, password: e.target.value})} 
                            required 
                        />
                    </div>
                    <button type="submit" className="login-btn">Initialize Session</button>
                    <div className="login-footer">SECURE CLOUD ACCESS v2.0</div>
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
                        <small>ADMIN_SESSION</small>
                        <p>Abhishek Singh</p>
                    </div>
                    <button className="logout-btn" onClick={() => {localStorage.clear(); window.location.reload();}}>Terminate Session</button>
                </div>
            </aside>

            <main className="content">
                <header>
                    <h1>{activeTab.toUpperCase()}</h1>
                    <div className="header-btns">
                        <button className="tool-btn">📄 Export</button>
                        <button className="tool-btn">📧 Mail</button>
                        <span className={loading ? "status-busy" : "status-live"}>
                            {loading ? "● UPDATING..." : "● LIVE_SYSTEM"}
                        </span>
                    </div>
                </header>

                <div className="view-port">
                    {activeTab === 'inventory' && (
                        <>
                            <form onSubmit={(e) => e.preventDefault()} className="inventory-form">
                                <input placeholder="Name" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
                                <input placeholder="Category" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} />
                                <input type="number" placeholder="Stock" value={newItem.stock} onChange={e => setNewItem({...newItem, stock: e.target.value})} />
                                <button type="submit">Add</button>
                            </form>
                            <div className="glass-card">
                                <table className="data-table">
                                    <thead><tr><th>NAME</th><th>CATEGORY</th><th>STOCK</th><th>ACTION</th></tr></thead>
                                    <tbody>
                                        {inventory.length > 0 ? inventory.map((item, idx) => (
                                            <tr key={idx}>
                                                <td>{item.name}</td><td>{item.category}</td>
                                                <td className="white-text">{item.stock}</td>
                                                <td><button className="del-btn">🗑️</button></td>
                                            </tr>
                                        )) : <tr><td colSpan="4" className="center-text">Synchronizing...</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                    {/* Audit, Reports, Master content remains same as previous updates */}
                </div>
            </main>
        </div>
    );
}

export default App;