const express = require('express');
const app = express();
app.use(express.json());

const assets = [
    { id: "TX-900", name: "Core Reactor A", status: "Stable/94%" },
    { id: "TX-450", name: "Cooling Unit B", status: "Warning/62%" },
    { id: "TX-102", name: "Power Grid C", status: "Critical/12%" }
];

// Gateway routes /assets/list -> this /list
app.get('/list', (req, res) => res.json(assets));

app.listen(5002, () => console.log('📦 Asset Service: Port 5002'));