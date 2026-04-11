import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API = process.env.REACT_APP_API_URL;

function App() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('icms_user')));
    const [inventory, setInventory] = useState([]);
    const [newItem, setNewItem] = useState({ name: '', category: '', stock: '', status: 'In Stock' });
    const [credentials, setCredentials] = useState({ email: '', password: '' });

    // Data Load karne ke liye function
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

    // --- ADD ITEM FUNCTION ---
    const addItem = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API}/system/inventory`, newItem);
            setNewItem({ name: '', category: '', stock: '', status: 'In Stock' });
            fetchInventory(); // List refresh karein
        } catch (err) { alert("Add failed"); }
    };

    // --- DELETE ITEM FUNCTION ---
    const deleteItem = async (id) => {
        if (window.confirm("Kyu aap ise delete karna chahte hain?")) {
            try {
                await axios.delete(`${API}/system/inventory/${id}`);
                fetchInventory(); // List refresh karein
            } catch (err) { alert("Delete failed"); }
        }
    };

    if (!user) {
        return (
            <div className="login-page">
                <form onSubmit={handleLogin} className="login-card">
                    <h2>OMNICYCLE LOGIN</h2>
                    <input type="email" placeholder="Email" onChange={e => setCredentials({...credentials, email: e.target.value})} />
                    <input type="password" placeholder="Password" onChange={e => setCredentials({...credentials, password: e.target.value})} />
                    <button type="submit" className="primary-btn">Initialize Session</button>
                </form>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <h3>OMNICYCLE PRO</h3>
                <button onClick={() => setUser(null)}>Terminate Session</button>
            </aside>

            <main className="main-content">
                <header>
                    <h2>INVENTORY MANAGEMENT</h2>
                    {/* ADD ITEM FORM */}
                    <form onSubmit={addItem} className="add-form">
                        <input placeholder="Name" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} required />
                        <input placeholder="Category" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} required />
                        <input type="number" placeholder="Stock" value={newItem.stock} onChange={e => setNewItem({...newItem, stock: e.target.value})} required />
                        <button type="submit" className="add-btn">+ Add Item</button>
                    </form>
                </header>

                <table className="inventory-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Stock</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.map(item => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.category}</td>
                                <td>{item.stock}</td>
                                <td>
                                    <button onClick={() => deleteItem(item.id)} className="delete-btn">🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
        </div>
    );
}

export default App;