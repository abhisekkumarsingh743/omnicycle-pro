import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API = process.env.REACT_APP_API_URL;

function App() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('icms_user')));
    const [inventory, setInventory] = useState([]);
    const [newItem, setNewItem] = useState({ name: '', category: '', stock: '' });
    const [credentials, setCredentials] = useState({ email: '', password: '' });

    // --- Data Load Function ---
    const fetchInventory = async () => {
        try {
            const res = await axios.get(`${API}/system/inventory`); // Gateway path match
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

    const handleTerminate = () => {
        localStorage.removeItem('icms_user');
        setUser(null);
    };

    // --- ADD FUNCTION ---
    const addItem = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API}/system/inventory`, newItem); // CORS test for POST
            setNewItem({ name: '', category: '', stock: '' }); // Reset form
            fetchInventory(); // Refresh table
        } catch (err) { alert("Add failed. Backend down?"); }
    };

    // --- DELETE FUNCTION ---
    const deleteItem = async (id) => {
        if (window.confirm("Bhai, use hamesha ke liye delete kar du?")) {
            try {
                await axios.delete(`${API}/system/inventory/${id}`); // CORS test for DELETE
                fetchInventory(); // Refresh table
            } catch (err) { alert("Delete failed. Check logs."); }
        }
    };

    if (!user) {
        return (
            <div className="app login-view">
                <form onSubmit={handleLogin} className="login-box">
                    <h1>OMNICYCLE PRO</h1>
                    <input type="email" placeholder="Email" onChange={e => setCredentials({...credentials, email: e.target.value})} required />
                    <input type="password" placeholder="Password" onChange={e => setCredentials({...credentials, password: e.target.value})} required />
                    <button type="submit" className="primary-btn">Initialize Session</button>
                </form>
            </div>
        );
    }

    return (
        <div className="app dashboard-view">
            <aside className="main-sidebar">
                <h2>OMNICYCLE PRO</h2>
                <nav>
                    <button className="active">📦 Inventory</button>
                    <button disabled>📊 Reports</button>
                </nav>
                <button onClick={handleTerminate} className="terminate-btn">Terminate Session</button>
            </aside>

            <main className="main-content">
                <header>
                    <div className="title-row">
                        <h1>Inventory Management</h1>
                    </div>
                    {/* ADD ITEM FORM (Pichli CSS error thi yahan) */}
                    <form onSubmit={addItem} className="add-item-bar">
                        <input placeholder="Name" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} required />
                        <input placeholder="Category" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} required />
                        <input type="number" placeholder="Stock" value={newItem.stock} onChange={e => setNewItem({...newItem, stock: e.target.value})} required />
                        <button type="submit" className="add-btn">+ Add Item</button>
                    </form>
                </header>

                <div className="table-wrapper">
                    <table className="inventory-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Stock</th>
                                <th style={{textAlign: 'center'}}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.map(item => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.category}</td>
                                    <td className="stock-count">{item.stock}</td>
                                    <td className="action-cell">
                                        <button onClick={() => deleteItem(item.id)} className="delete-btn">🗑️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}

export default App;