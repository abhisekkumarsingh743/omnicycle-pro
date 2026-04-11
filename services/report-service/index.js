const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.status(200).send("REPORT_SERVICE_OPERATIONAL"));

// Metrics Data API
app.get('/api/reports/metrics', (req, res) => {
    res.status(200).json({
        efficiency: "98.4%",
        uptime: "99.98%",
        activeNodes: 12,
        throughput: "450 units/hr"
    });
});

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => console.log(`📊 Report Service live on port ${PORT}`));