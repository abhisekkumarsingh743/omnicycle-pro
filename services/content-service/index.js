const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// In-memory data (Render par jab tak service active hai, data rahega)
let inventory = [
    { id: "IND-101", name: "Industrial Pump X1", category: "Machinery", stock: 12, status: "Active" },
    { id: "IND-102", name: "Steel Pipes 50mm", category: "Raw Material", stock: 45, status: "In-Stock" }
];

app.get('/api/content/inventory', (req, res) => res.json(inventory));

app.post('/api/content/inventory', (req, res) => {
    const newItem = { ...req.body, id: `IND-${Math.floor(Math.random() * 9000 + 1000)}` };
    inventory.unshift(newItem); // Naya item upar add hoga
    res.status(201).json(newItem);
});

app.delete('/api/content/inventory/:id', (req, res) => {
    inventory = inventory.filter(item => item.id !== req.params.id);
    res.status(200).json({ message: "Deleted Successfully" });
});

app.get('/', (req, res) => res.send("CONTENT_SERVICE_LIVE"));

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Content Service on ${PORT}`));