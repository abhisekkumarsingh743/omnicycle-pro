const express = require('express');
const app = express();
app.use(express.json());

let logs = [{ id: "LOG-01", user: "Abhisek Singh", action: "System Auth", timestamp: new Date() }];

app.get('/logs', (req, res) => res.json(logs));
app.post('/log', (req, res) => {
    logs.unshift({ id: `LOG-${logs.length + 1}`, ...req.body, timestamp: new Date() });
    res.sendStatus(201);
});

app.listen(5003, () => console.log('📜 Audit Service: Port 5003'));