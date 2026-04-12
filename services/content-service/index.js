const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const inventory = [
    { id: "IND-101", name: "Industrial Pump X1", category: "Machinery", stock: 12, status: "Active" },
    { id: "IND-102", name: "Steel Pipes 50mm", category: "Raw Material", stock: 45, status: "In-Stock" }
];

app.get('/', (req, res) => res.status(200).send("CONTENT_SERVICE_LIVE"));
app.get('/api/content/inventory', (req, res) => res.json(inventory));

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Content Service on ${PORT}`));