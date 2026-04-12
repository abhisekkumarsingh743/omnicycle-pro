const express = require('express');
const cors = require('cors');
const axios = require('axios');
app = express();
app.use(cors());
app.use(express.json());

const CONTENT_URL = process.env.CONTENT_SERVICE_URL;

app.get('/all-data', async (req, res) => {
    try {
        const inv = await axios.get(`${CONTENT_URL}/api/content/inventory`);
        res.json({ 
            inventory: inv.data, 
            metrics: { efficiency: "98.4%", uptime: "99.9%", nodes: 14 },
            auditLogs: [{ id: "L-1", event: "Admin Sync", operator: "Abhishek", time: new Date() }]
        });
    } catch (e) { res.status(500).send("Sync Error"); }
});

app.post('/add-item', async (req, res) => {
    try {
        const response = await axios.post(`${CONTENT_URL}/api/content/inventory`, req.body);
        res.json(response.data);
    } catch (e) { res.status(500).send("Add Error"); }
});

app.delete('/delete-item/:id', async (req, res) => {
    try {
        await axios.delete(`${CONTENT_URL}/api/content/inventory/${req.params.id}`);
        res.json({ success: true });
    } catch (e) { res.status(500).send("Delete Error"); }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Gateway on ${PORT}`));