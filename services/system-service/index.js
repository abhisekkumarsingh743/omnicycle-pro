const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let inventory = [
    { id: 1, name: "Industrial Pump X1", category: "Machinery", stock: 12 },
    { id: 2, name: "Steel Pipes 50mm", category: "Raw Material", stock: 45 }
];

app.get('/inventory', (req, res) => res.json(inventory));

app.post('/inventory', (req, res) => {
    const newItem = { id: Date.now(), ...req.body };
    inventory.push(newItem);
    res.status(201).json(newItem);
});

app.delete('/inventory/:id', (req, res) => {
    const { id } = req.params;
    inventory = inventory.filter(item => item.id !== parseInt(id));
    res.json({ message: "Deleted" });
});

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`System Service on ${PORT}`));