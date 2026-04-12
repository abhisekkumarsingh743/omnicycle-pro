const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const logs = [
    { id: "L-01", event: "Admin Login", operator: "Abhishek Singh", time: new Date().toISOString() }
];

app.get('/', (req, res) => res.status(200).send("AUDIT_SERVICE_LIVE"));
app.get('/api/audit/logs', (req, res) => res.json(logs));

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Audit Service on ${PORT}`));