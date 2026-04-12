import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Vercel par jo variable hai wahi yahan use kar rahe hain
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

function App() {
  const [data, setData] = useState({ inventory: [], auditLogs: [], metrics: {}, system: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE}/all-data`)
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="dashboard-container">
      <header className="elite-header">
        <h1>OMNICYCLE PRO</h1>
        <div className="status-badge">ONLINE</div>
      </header>

      <div className="grid-layout">
        <section className="table-card">
          <h3>INVENTORY DATA</h3>
          <table>
            <thead>
              <tr><th>REF_ID</th><th>ITEM</th><th>CATEGORY</th><th>QTY</th><th>STATUS</th></tr>
            </thead>
            <tbody>
              {data.inventory.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td><td>{item.name}</td><td>{item.category}</td><td>{item.stock}</td><td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="table-card">
          <h3>AUDIT TRAIL</h3>
          <table>
            <thead>
              <tr><th>LOG_ID</th><th>EVENT</th><th>OPERATOR</th><th>TIMESTAMP</th></tr>
            </thead>
            <tbody>
              {data.auditLogs.map(log => (
                <tr key={log.id}>
                  <td>{log.id}</td><td>{log.event}</td><td>{log.operator}</td><td>{new Date(log.time).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
export default App;