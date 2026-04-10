const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Professional Test Credentials
const USERS = [
    { email: 'admin@icms.com', password: 'password123', role: 'ADMIN', name: 'Abhisek Singh' },
    { email: 'user@icms.com', password: 'user123', role: 'USER', name: 'Niranjan Singh' }
];

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = USERS.find(u => u.email === email && u.password === password);
    
    if (user) {
        // SUCCESS: Sending complete user object including email
        res.json({ 
            success: true, 
            role: user.role, 
            name: user.name,
            email: user.email 
        });
    } else {
        res.status(401).json({ success: false, message: 'Security Violation: Invalid Credentials' });
    }
});

const PORT = 5001;
app.listen(PORT, () => console.log(`🔑 Auth Service Operational: Port ${PORT}`));