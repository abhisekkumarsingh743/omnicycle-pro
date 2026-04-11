import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API = process.env.REACT_APP_API_URL;

function App() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('icms_user')));
    const [data, setData] = useState([]); // Sabhi tabs ka data yahan rahega
    const [activeTab, setActiveTab] = useState('inventory');
    const [newItem, setNewItem] = useState({ name: '', category: '', stock: '' });
    const [credentials, setCredentials] = useState({ email: '', password: '' });

    // --- GLOBAL FETCH FUNCTION ---
    const fetchData = async () => {
        try {
            let endpoint = '';
            if (activeTab === 'inventory') endpoint = '/system/inventory';
            else if (activeTab === 'audit') endpoint = '/audit/logs';
            else if (activeTab === 'reports') endpoint = '/reports/data';
            else if (activeTab === 'master') endpoint = '/system/master';

            const res = await axios.get(`${API}${endpoint}`);
            setData(Array.isArray(res.data) ? res.data : []);
        } catch (err) { 
            console.error("Fetch Error:", err);
            setData([]); // Error aane par empty array set karein taaki crash na ho
        }
    };

    // Tab change hone par ya login hone par data fetch karein
    useEffect(() => {
        if (user) fetchData();
    }, [user, activeTab]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API}/auth/login`, credentials);
            localStorage.setItem('icms_user', JSON.stringify(res.data));
            setUser(res.data);
        } catch (err) { alert("Invalid Credentials"); }
    };

    const addItem = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API}/system/inventory`, newItem);
            setNewItem({ name: '', category: '', stock: '' });
            fetchData(); // List refresh
        } catch (err) { alert("Add failed"); }
    };

    const deleteItem = async (id) => {
        if (window.confirm("Confirm delete?")) {
            try {
                await axios.delete(`${API}/system/inventory/${id}`);
                fetchData(); // List refresh
            } catch (err) { alert("Delete failed"); }
        }
    };

    if (!user) {
        return (
            <div className="login-container">
                <form onSubmit={handleLogin} className="login-card">
                    <h1>OMNICYCLE LOGIN</h1>
                    <input type="email" placeholder="Email" onChange={e => setCredentials({...credentials, email: e.target.value})} required />
                    <input type="password" placeholder="Password" onChange={e => setCredentials({...credentials, password: e.target.value})} required />
                    <button type="submit" className="login-btn">Initialize Session</button>
                </form>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <aside className="sidebar">
                <div className="brand">OMNICYCLE PRO</div>
                <nav>
                    <button className={activeTab === 'inventory' ? 'active' : ''} onClick={() => setActiveTab('inventory')}>📦 Inventory</button>
                    <button className={activeTab === 'audit' ? 'active' : ''} onClick={() => setActiveTab('audit')}>📜 Audit Trail</button>
                    <button className={activeTab === 'reports' ? 'active' : ''} onClick={() => setActiveTab('reports')}>📊 Reports</button>
                    <button className={activeTab === 'master' ? 'active' : ''} onClick={() => setActiveTab('master')}>📁 Master Data</button>
                </nav>
                <div className="user-info">
                    <p>ADMIN SESSION</p>
                    <span>Abhishek Singh</span>
                    <button className="logout-btn" onClick={() => {localStorage.removeItem('icms_user'); setUser(null);}}>Terminate Session</button>
                </div>
            </aside>

            <main className="content">
                <header>
                    <h1>{activeTab.toUpperCase()}</h1>
                    <div className="status-indicator">● LIVE_SYSTEM</div>
                </header>

                {activeTab === 'inventory' ? (
                    <div className="inventory-view">
                        <form onSubmit={addItem} className="add-bar">
                            <input placeholder="Name" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} required />
                            <input placeholder="Category" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} required />
                            <input type="number" placeholder="Stock" value={newItem.stock} onChange={e => setNewItem({...newItem, stock: e.target.value})} required />
                            <button type="submit" className="add-btn">+ Add Item</button>
                        </form>
                        <div className="glass-card">
                            <table className="data-table">
                                <thead>
                                    <tr><th>NAME</th><th>CATEGORY</th><th>STOCK</th><th>ACTION</th></tr>
                                </thead>
                                <tbody>
                                    {data.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.name}</td>
                                            <td>{item.category}</td>
                                            <td>{item.stock}</td>
                                            <td><button onClick={() => deleteItem(item.id)} className="del-btn">🗑️</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="glass-card">
                        {data.length > 0 ? (
                            <pre className="raw-data">{JSON.stringify(data, null, 2)}</pre>
                        ) : (
                            <div className="empty">No system data available for {activeTab} yet.</div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;