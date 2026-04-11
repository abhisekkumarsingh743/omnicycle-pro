const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Health Check for Render
app.get('/', (req, res) => res.status(200).send("INDUSTRIAL_GATEWAY_V5_LIVE"));

// THE MAIN DATA ENDPOINT
app.get('/all-data', (req, res) => {
    console.log("Sync request received from Frontend");
    res.status(200).json({
        inventory: [
            { id: "IND-101", name: "Industrial Pump X1", category: "Machinery", stock: 12, status: "Active" },
            { id: "IND-102", name: "Steel Pipes 50mm", category: "Raw Material", stock: 45, status: "In-Stock" },
            { id: "IND-103", name: "Logic Controller", category: "Electronics", stock: 8, status: "Repair" },
            { id: "IND-104", name: "Hydraulic Oil", category: "Consumables", stock: 150, status: "Active" }
        ],
        auditLogs: [
            { id: "LOG-01", event: "User Login", operator: "Abhishek Singh", time: new Date().toISOString() },
            { id: "LOG-02", event: "Stock Sync", operator: "System", time: new Date().toISOString() }
        ],
        metrics: { warehouses: 4, nodes: 12, uptime: "99.9%", efficiency: "98.4%" }
    });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Backend Active on Port ${PORT}`));