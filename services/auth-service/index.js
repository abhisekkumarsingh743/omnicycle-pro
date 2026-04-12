const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const USERS = [
    { email: 'admin@icms.com', password: 'password123', role: 'ADMIN', name: 'Abhishek Singh' }
];

app.get('/', (req, res) => res.status(200).send("AUTH_SERVICE_LIVE"));

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = USERS.find(u => u.email === email && u.password === password);
    if (user) {
        res.json({ success: true, role: user.role, name: user.name, email: user.email });
    } else {
        res.status(401).json({ success: false, message: 'Invalid Credentials' });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Auth Service on ${PORT}`));