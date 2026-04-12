const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.get('/all-data', (req, res) => {
    res.json({
        inventory: [
            { id: "IND-101", name: "Industrial Pump X1", category: "Machinery", stock: 12, status: "Active" },
            { id: "IND-102", name: "Steel Pipes 50mm", category: "Raw Material", stock: 45, status: "In-Stock" },
            { id: "IND-103", name: "Valve Controller", category: "Electronics", stock: 8, status: "Repair" }
        ],
        auditLogs: [
            { id: "LOG-100", event: "Master Sync", operator: "Abhishek Singh", time: new Date().toISOString() }
        ],
        metrics: { warehouses: 4, nodes: 12, uptime: "99.9%", efficiency: "98.4%" }
    });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Gateway Live on ${PORT}`));