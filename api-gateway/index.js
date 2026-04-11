const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// FIXED: Base URL check
app.get('/', (req, res) => res.send("Industrial CMS Gateway Active"));

// FIXED: Route for all-data (Frontend isko hit karega)
app.get('/all-data', (req, res) => {
    res.json({
        inventory: [
            { id: "IND-001", name: "Industrial Pump X1", category: "Machinery", stock: 12, status: "Active" },
            { id: "IND-002", name: "Steel Pipes 50mm", category: "Raw Material", stock: 45, status: "In-Stock" },
            { id: "IND-003", name: "Logic Controller", category: "Electronics", stock: 8, status: "Maintenance" }
        ],
        auditLogs: [
            { id: "L-1", event: "Admin Login", user: "Abhishek Singh", timestamp: new Date().toISOString() },
            { id: "L-2", event: "Inventory Sync", user: "System", timestamp: new Date().toISOString() }
        ],
        metrics: { warehouses: 4, nodes: 12, uptime: "99.9%" }
    });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Gateway running on port ${PORT}`));