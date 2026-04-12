const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const inventoryData = [
    { id: "IND-101", name: "Industrial Pump X1", category: "Machinery", stock: 12, status: "Active" },
    { id: "IND-102", name: "Steel Pipes 50mm", category: "Raw Material", stock: 45, status: "In-Stock" },
    { id: "IND-103", name: "Valve Controller", category: "Electronics", stock: 8, status: "Repair" }
];

app.get('/api/content/inventory', (req, res) => res.json(inventoryData));
app.get('/', (req, res) => res.send("CONTENT_SERVICE_LIVE"));

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Content running on ${PORT}`));