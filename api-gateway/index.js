const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Render Environment Variables
const AUTH_URL = process.env.AUTH_SERVICE_URL;
const CONTENT_URL = process.env.CONTENT_SERVICE_URL;
const AUDIT_URL = process.env.AUDIT_SERVICE_URL;
const REPORT_URL = process.env.REPORT_SERVICE_URL;
const SYSTEM_URL = process.env.SYSTEM_SERVICE_URL;

app.get('/all-data', async (req, res) => {
    try {
        // Sabhi services se data fetch karne ki koshish (Parallel Calls)
        // Note: Agar koi service down hai toh hum empty array bhejenge crash hone ki jagah
        const [inv, aud, rep, sys] = await Promise.allSettled([
            axios.get(`${CONTENT_URL}/api/content/inventory`),
            axios.get(`${AUDIT_URL}/api/audit/logs`),
            axios.get(`${REPORT_URL}/api/reports/metrics`),
            axios.get(`${SYSTEM_URL}/api/system/health`)
        ]);

        res.json({
            inventory: inv.status === 'fulfilled' ? inv.value.data : [],
            auditLogs: aud.status === 'fulfilled' ? aud.value.data : [],
            metrics: rep.status === 'fulfilled' ? rep.value.data : { efficiency: "N/A", uptime: "N/A" },
            system: sys.status === 'fulfilled' ? sys.value.data : { status: "Offline" }
        });
    } catch (error) {
        console.error("Gateway Sync Error:", error.message);
        res.status(500).json({ error: "Could not sync with microservices" });
    }
});

// Health check
app.get('/', (req, res) => res.send("GATEWAY_ONLINE"));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Industrial Gateway active on ${PORT}`));