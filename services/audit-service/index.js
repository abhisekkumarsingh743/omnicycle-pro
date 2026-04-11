const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/audit/logs', (req, res) => {
    res.json([{ id: "L-01", event: "System Sync", operator: "Abhishek", time: new Date() }]);
});

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`📜 Audit Service Online`));