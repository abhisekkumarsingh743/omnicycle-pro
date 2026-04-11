const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/reports/metrics', (req, res) => {
    res.json({ efficiency: "98.4%", uptime: "99.9%", activeNodes: 12 });
});

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => console.log(`📊 Report Service: Port ${PORT}`));