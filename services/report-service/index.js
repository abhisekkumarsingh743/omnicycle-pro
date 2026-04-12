const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/reports/metrics', (req, res) => {
    res.json({ efficiency: "98.4%", uptime: "99.9%", nodes: 12, warehouses: 4 });
});
app.get('/', (req, res) => res.send("REPORT_SERVICE_LIVE"));

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => console.log(`Report running on ${PORT}`));