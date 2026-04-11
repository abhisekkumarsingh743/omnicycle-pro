const express = require('express');
const cors = require('cors');
const app = express();

// --- ZAROORI: Ye fixed CORS setup lagayein ---
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// In-Memory Data (Server restart par clear ho jayega, permanent ke liye baad mein DB use karein)
let inventory = [
    { id: 1, name: "Industrial Pump X1", category: "Machinery", stock: 12 },
    { id: 2, name: "Steel Pipes 50mm", category: "Raw Material", stock: 45 }
];

// GET: Inventory List
app.get('/inventory', (req, res) => {
    res.json(inventory);
});

// POST: Add New Item
app.post('/inventory', (req, res) => {
    const newItem = {
        id: Date.now(), 
        ...req.body
    };
    inventory.push(newItem);
    console.log("Item Added:", newItem);
    res.status(201).json(newItem);
});

// DELETE: Remove Item
app.delete('/inventory/:id', (req, res) => {
    const { id } = req.params;
    inventory = inventory.filter(item => item.id !== parseInt(id));
    console.log("Item Deleted ID:", id);
    res.json({ message: "Item deleted successfully" });
});

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
    console.log(`System Service active on port ${PORT}`);
});