import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_GATEWAY_URL || "http://localhost:8000";

function App() {
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem('icms_v6')));
  const [tab, setTab] = useState('inventory');
  const [data, setData] = useState({ inventory: [], auditLogs: [], metrics: {} });

  useEffect(() => {
    if (auth) {
      axios.get(`${API_URL}/all-data`).then(res => setData(res.data)).catch(e => console.log("Sync Error"));
    }
  }, [auth, tab]);

  if (!auth) return (
    <div className="login-page">
      <div className="login-card">
        <h1>OMNICYCLE</h1>
        <button onClick={() => {
          const user = {name: "Abhishek Singh", role: "ADMIN"};
          localStorage.setItem('icms_v6', JSON.stringify(user));
          setAuth(user);
        }}>DEMO LOGIN</button>
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <nav className="sidebar">
        <h2>ICMS PRO</h2>
        <button onClick={() => setTab('inventory')}>📦 Inventory</button>
        <button onClick={() => setTab('audit')}>📜 Audit</button>
        <button onClick={() => {localStorage.clear(); window.location.reload();}}>Logout</button>
      </nav>
      <main className="content">
        <header><h2>{tab.toUpperCase()}</h2></header>
        <div className="table-container">
          {tab === 'inventory' ? (
            <table>
              <thead><tr><th>ID</th><th>NAME</th><th>STOCK</th><th>STATUS</th></tr></thead>
              <tbody>
                {data.inventory.map(item => (
                  <tr key={item.id}><td>{item.id}</td><td>{item.name}</td><td>{item.stock}</td><td>{item.status}</td></tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table>
              <thead><tr><th>ID</th><th>EVENT</th><th>TIME</th></tr></thead>
              <tbody>
                {data.auditLogs.map(log => (
                  <tr key={log.id}><td>{log.id}</td><td>{log.event}</td><td>{log.time}</td></tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
export default App;