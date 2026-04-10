const express = require('express');
const Redis = require('ioredis');
const app = express();
const redis = new Redis();

app.use(express.json());

app.post('/export', async (req, res) => {
    const { type, email } = req.body;
    const job = { type, targetEmail: email, timestamp: new Date() };
    await redis.lpush('report_queue', JSON.stringify(job));
    res.json({ message: "PDF generation started. Check email shortly." });
});

app.listen(5004, () => console.log('📊 Report Service: Port 5004'));