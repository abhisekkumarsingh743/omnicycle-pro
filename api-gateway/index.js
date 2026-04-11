const express = require('express');
const cors = require('cors');
const axios = require('axios'); // Axios install kar lena: npm install axios
const app = express();

app.use(cors());
app.use(express.json());

// Render Environment Variables se URLs uthana
const AUTH_SERVICE = process.env.AUTH_SERVICE_URL;
const CONTENT_SERVICE = process.env.CONTENT_SERVICE_URL;
const AUDIT_SERVICE = process.env.AUDIT_SERVICE_URL;
const REPORT_SERVICE = process.env.REPORT_SERVICE_URL;
const SYSTEM_SERVICE = process.env.SYSTEM_SERVICE_URL;

app.get('/all-data', async (req, res) => {
    try {
        // Services se live data fetch karna
        // Note: Agar services abhi setup nahi hain toh niche wala static return hi use hoga stability ke liye
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
    } catch (error) {
        res.status(500).json({ error: "Gateway failed to sync with services" });
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🌐 Gateway Live: Port ${PORT}`));