const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 1. Health Check (Browser mein check karne ke liye)
app.get('/', (req, res) => res.status(200).send("Industrial CMS Gateway Live"));

// 2. FIXED: Frontend issi route ko hit karega
app.get('/all-data', (req, res) => {
    console.log("Data request received");
    res.status(200).json({
        inventory: [
            { id: 1, name: "Industrial Pump X1", category: "Machinery", stock: 12 },
            { id: 2, name: "Steel Pipes 50mm", category: "Raw Material", stock: 45 },
            { id: 3, name: "Logic Controller", category: "Electronics", stock: 8 }
        ],
        auditLogs: [
            { id: "LOG-101", event: "Admin Login", user: "Abhishek Singh", timestamp: new Date() },
            { id: "LOG-102", event: "Gateway Sync", user: "System", timestamp: new Date() }
        ],
        metrics: { warehouses: 4, nodes: 12, uptime: "99.9%" }
    });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));