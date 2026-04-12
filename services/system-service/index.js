const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/system/health', (req, res) => {
    res.json({ status: "Optimum", lastSync: new Date().toISOString(), database: "Connected" });
});
app.get('/', (req, res) => res.send("SYSTEM_SERVICE_LIVE"));

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`System running on ${PORT}`));