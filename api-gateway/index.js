const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// FIXED: Added all-data route for frontend sync
app.get('/all-data', (req, res) => {
    res.json({
        inventory: [
            { name: "Industrial Pump X1", category: "Machinery", stock: 12 },
            { name: "Steel Pipes 50mm", category: "Raw Material", stock: 45 }
        ],
        auditLogs: [
            { event: "Gateway Handshake", status: "200 OK", timestamp: new Date() }
        ],
        metrics: { warehouses: 4, nodes: 12, uptime: "99.9%" }
    });
});

app.listen(process.env.PORT || 8000, () => console.log("Gateway Live on Port 8000"));