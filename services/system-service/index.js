const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.status(200).send("SYSTEM_SERVICE_OPERATIONAL"));

// System Health API
app.get('/api/system/health', (req, res) => {
    res.status(200).json({
        warehouses: 4,
        systemStatus: "Optimum",
        lastSync: new Date().toISOString(),
        database: "Connected"
    });
});

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`⚙️ System Service live on port ${PORT}`));