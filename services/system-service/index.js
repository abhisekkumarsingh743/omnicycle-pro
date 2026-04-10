const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const INVENTORY_DB = [
    { id: 'AST-001', name: 'Core Reactor A', status: 'Stable/94%' },
    { id: 'AST-002', name: 'Cooling Unit B', status: 'Warning/62%' },
    { id: 'AST-003', name: 'Power Grid C', status: 'Critical/12%' }
];

app.get('/all-data', async (req, res) => {
    try {
        // Render par deployment ke baad yahan Render ka URL aayega
        const auditUrl = process.env.AUDIT_SERVICE_URL || 'http://localhost:5003';
        const logs = await axios.get(`${auditUrl}/logs`);
        res.json({ status: "SUCCESS", inventory: INVENTORY_DB, audit_trail: logs.data });
    } catch (err) {
        res.json({ status: "PARTIAL", inventory: INVENTORY_DB, audit_trail: [] });
    }
});

app.get('/inventory-only', (req, res) => res.json(INVENTORY_DB));

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`System Service on port ${PORT}`));