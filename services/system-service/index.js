const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Sample Initial Data
let inventory = [
    { id: 1, name: "Industrial Pump", category: "Machinery", stock: 12, status: "In Stock" },
    { id: 2, name: "Steel Pipes", category: "Raw Material", stock: 45, status: "Low Stock" }
];

// GET: Inventory List fetch karne ke liye
app.get('/inventory', (req, res) => {
    res.json(inventory);
});

// POST: Naya Item Add karne ke liye
app.post('/inventory', (req, res) => {
    const newItem = {
        id: Date.now(), // Unique ID ke liye timestamp
        ...req.body
    };
    inventory.push(newItem);
    console.log("Item Added:", newItem);
    res.status(201).json(newItem);
});

// DELETE: Item hatane ke liye
app.delete('/inventory/:id', (req, res) => {
    const { id } = req.params;
    inventory = inventory.filter(item => item.id !== parseInt(id));
    console.log("Item Deleted ID:", id);
    res.json({ message: "Item deleted successfully" });
});

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
    console.log(`System Service running on port ${PORT}`);
});