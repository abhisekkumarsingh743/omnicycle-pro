const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // Global access for frontend
app.use(express.json());

// Base health check
app.get('/', (req, res) => res.status(200).send("GATEWAY_V4_ONLINE"));

// Main Data Endpoint
app.get('/all-data', (req, res) => {
    res.status(200).json({
        inventory: [
            { id: "IND-101", name: "Industrial Pump X1", category: "Machinery", stock: 12, status: "Active" },
            { id: "IND-102", name: "Steel Pipes 50mm", category: "Raw Material", stock: 45, status: "In-Stock" },
            { id: "IND-103", name: "Valve Controller", category: "Electronics", stock: 8, status: "Repair" },
            { id: "IND-104", name: "Hydraulic Oil", category: "Consumables", stock: 150, status: "Active" }
        ],
        auditLogs: [
            { id: "L-101", event: "Admin Auth", user: "Abhishek Singh", timestamp: new Date().toISOString() },
            { id: "L-102", event: "Inventory Sync", user: "System", timestamp: new Date().toISOString() }
        ],
        metrics: { warehouses: 4, nodes: 12, uptime: "99.9%", efficiency: "98.4%" }
    });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server live on ${PORT}`));