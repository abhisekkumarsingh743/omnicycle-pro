const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// FIXED: Base health check
app.get('/', (req, res) => res.send("Gateway Operational"));

// FIXED: Single Sync Point for Frontend
app.get('/all-data', (req, res) => {
    res.json({
        inventory: [
            { id: 1, name: "Industrial Pump X1", category: "Machinery", stock: 12 },
            { id: 2, name: "Steel Pipes 50mm", category: "Raw Material", stock: 45 },
            { id: 3, name: "Valve Controller", category: "Electronics", stock: 8 }
        ],
        auditLogs: [
            { id: "LOG-101", event: "System Handshake", user: "Abhishek Singh", timestamp: new Date() },
            { id: "LOG-102", event: "Admin Login", user: "Abhishek Singh", timestamp: new Date() }
        ],
        metrics: { warehouses: 4, nodes: 12, uptime: "99.9%" }
    });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Backend Server Live on Port ${PORT}`));