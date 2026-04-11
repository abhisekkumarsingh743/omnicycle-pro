const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // Allow all origins for testing
app.use(express.json());

// Base Route
app.get('/', (req, res) => res.send("Industrial CMS Gateway Online"));

// FIXED: Consolidated Data Endpoint
app.get('/all-data', (req, res) => {
    res.json({
        inventory: [
            { id: "IND-101", name: "Industrial Pump X1", category: "Machinery", stock: 12, status: "Active" },
            { id: "IND-102", name: "Steel Pipes 50mm", category: "Raw Material", stock: 45, status: "In-Stock" },
            { id: "IND-103", name: "Logic Controller", category: "Electronics", stock: 8, status: "Maintenance" }
        ],
        auditLogs: [
            { id: "L-01", event: "Admin Auth", user: "Abhishek Singh", timestamp: new Date().toISOString() },
            { id: "L-02", event: "Gateway Sync", user: "System", timestamp: new Date().toISOString() }
        ],
        metrics: { warehouses: 4, nodes: 12, uptime: "99.9%", activeStaff: 24 }
    });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Backend live on ${PORT}`));