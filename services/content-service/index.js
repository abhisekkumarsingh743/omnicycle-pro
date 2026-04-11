const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Root Health Check (Render ke liye zaroori h)
app.get('/', (req, res) => res.status(200).send("CONTENT_SERVICE_OPERATIONAL"));

// Inventory Data API
app.get('/api/content/inventory', (req, res) => {
    res.status(200).json([
        { id: "IND-101", name: "Industrial Pump X1", category: "Machinery", stock: 12, status: "Active" },
        { id: "IND-102", name: "Steel Pipes 50mm", category: "Raw Material", stock: 45, status: "In-Stock" },
        { id: "IND-103", name: "Valve Controller", category: "Electronics", stock: 8, status: "Repair" },
        { id: "IND-104", name: "Hydraulic Fluid", category: "Consumables", stock: 200, status: "Active" }
    ]);
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`📦 Content Service live on port ${PORT}`));