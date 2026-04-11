const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.status(200).send("AUDIT_SERVICE_OPERATIONAL"));

// Logs Data API
app.get('/api/audit/logs', (req, res) => {
    res.status(200).json([
        { id: "LOG-01", event: "Admin Login", operator: "Abhishek Singh", time: new Date().toISOString() },
        { id: "LOG-02", event: "Inventory Sync", operator: "System Node", time: new Date().toISOString() },
        { id: "LOG-03", event: "Metric Calculation", operator: "Reporting Bot", time: new Date().toISOString() }
    ]);
});

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`📜 Audit Service live on port ${PORT}`));