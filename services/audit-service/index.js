const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const logs = [
    { id: "L-101", event: "System Handshake", operator: "Abhishek Singh", time: new Date().toISOString() }
];

app.get('/api/audit/logs', (req, res) => res.json(logs));
app.get('/', (req, res) => res.send("AUDIT_SERVICE_LIVE"));

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Audit running on ${PORT}`));