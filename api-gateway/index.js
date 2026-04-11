const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// FIXED ROUTE: Frontend isi ko hit karega
app.get('/all-data', (req, res) => {
    res.json({
        inventory: [
            { name: "Industrial Pump X1", category: "Machinery", stock: 12 },
            { name: "Steel Pipes 50mm", category: "Raw Material", stock: 45 }
        ],
        auditLogs: [
            { id: "LOG-01", event: "Gateway Handshake", status: "200 OK", timestamp: new Date() },
            { id: "LOG-02", event: "Admin Login", status: "Success", timestamp: new Date() }
        ],
        metrics: { warehouses: 4, nodes: 12, uptime: "99.9%" }
    });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Gateway running on port ${PORT}`));