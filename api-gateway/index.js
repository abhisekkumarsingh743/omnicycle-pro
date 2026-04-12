const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

const SERVICES = {
    auth: process.env.AUTH_SERVICE_URL,
    content: process.env.CONTENT_SERVICE_URL,
    audit: process.env.AUDIT_SERVICE_URL,
    report: process.env.REPORT_SERVICE_URL,
    system: process.env.SYSTEM_SERVICE_URL
};

app.get('/all-data', async (req, res) => {
    try {
        // Services se live data fetch karna
        const [inv, aud, rep, sys] = await Promise.allSettled([
            axios.get(`${SERVICES.content}/api/content/inventory`),
            axios.get(`${SERVICES.audit}/api/audit/logs`),
            axios.get(`${SERVICES.report}/api/reports/metrics`),
            axios.get(`${SERVICES.system}/api/system/health`)
        ]);

        res.json({
            inventory: inv.status === 'fulfilled' ? inv.value.data : [],
            auditLogs: aud.status === 'fulfilled' ? aud.value.data : [],
            metrics: rep.status === 'fulfilled' ? rep.value.data : {},
            system: sys.status === 'fulfilled' ? sys.value.data : {}
        });
    } catch (error) {
        res.status(500).json({ error: "Gateway failed to fetch data" });
    }
});

app.get('/', (req, res) => res.send("GATEWAY_READY"));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Gateway running on ${PORT}`));