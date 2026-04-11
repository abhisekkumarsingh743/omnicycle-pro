import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API = process.env.REACT_APP_API_URL;

function App() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('icms_user')));
    const [inventory, setInventory] = useState([]);
    const [activeTab, setActiveTab] = useState('inventory');
    const [newItem, setNewItem] = useState({ name: '', category: '', stock: '' });
    const [credentials, setCredentials] = useState({ email: '', password: '' });

    const fetchInventory = async () => {
        try {
            const res = await axios.get(`${API}/system/inventory`);
            setInventory(res.data);
        } catch (err) { console.error("Fetch Error", err); }
    };

    useEffect(() => {
        if (user) fetchInventory();
    }, [user]);

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
            fetchInventory();
        } catch (err) { alert("Add failed"); }
    };

    const deleteItem = async (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                await axios.delete(`${API}/system/inventory/${id}`);
                fetchInventory();
            } catch (err) { alert("Delete failed"); }
        }
    };

    if (!user) {
        return (
            <div className="login-container">
                <form onSubmit={handleLogin} className="login-card">
                    <h1>OMNICYCLE LOGIN</h1>
                    <div className="input-group">
                        <input type="email" placeholder="Email" onChange={e => setCredentials({...credentials, email: e.target.value})} required />
                        <input type="password" placeholder="Password" onChange={e => setCredentials({...credentials, password: e.target.value})} required />
                    </div>
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
                    <h1>{activeTab.toUpperCase().replace('_', ' ')}</h1>
                    <div className="status-indicator">● LIVE_SYSTEM</div>
                </header>

                {activeTab === 'inventory' && (
                    <div className="inventory-section">
                        <form onSubmit={addItem} className="add-item-form">
                            <input placeholder="Item Name" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} required />
                            <input placeholder="Category" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} required />
                            <input type="number" placeholder="Stock" value={newItem.stock} onChange={e => setNewItem({...newItem, stock: e.target.value})} required />
                            <button type="submit" className="add-btn">+ Add Item</button>
                        </form>

                        <div className="glass-card">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>NAME</th>
                                        <th>CATEGORY</th>
                                        <th>STOCK</th>
                                        <th>ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inventory.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.name}</td>
                                            <td>{item.category}</td>
                                            <td className="stock-val">{item.stock}</td>
                                            <td>
                                                <button onClick={() => deleteItem(item.id)} className="del-icon">🗑️</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab !== 'inventory' && (
                    <div className="glass-card empty-state">
                        <p>No system data available for {activeTab} yet.</p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;