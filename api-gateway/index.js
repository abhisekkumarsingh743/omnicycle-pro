const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Base route for health check
app.get('/', (req, res) => res.status(200).send("OMNICYCLE_GATEWAY_V3_ONLINE"));

// FIXED: Sabse important endpoint
app.get('/all-data', (req, res) => {
    console.log("Request received for all-data");
    res.status(200).json({
        inventory: [
            { id: "IND-101", name: "Industrial Pump X1", category: "Machinery", stock: 12, status: "Active" },
            { id: "IND-102", name: "Steel Pipes 50mm", category: "Raw Material", stock: 45, status: "In-Stock" },
            { id: "IND-103", name: "Valve Controller", category: "Electronics", stock: 8, status: "Maintenance" },
            { id: "IND-104", name: "Hydraulic Fluid", category: "Consumables", stock: 120, status: "Active" }
        ],
        auditLogs: [
            { id: "L-1", event: "Gateway Handshake", user: "Abhishek Singh", timestamp: new Date().toISOString() },
            { id: "L-2", event: "Admin Auth", user: "Abhishek Singh", timestamp: new Date().toISOString() }
        ],
        metrics: { warehouses: 4, nodes: 12, uptime: "99.9%", activeStaff: 24 }
    });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server live on port ${PORT}`));