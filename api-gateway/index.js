const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// CORS allow karna zaroori hai taaki Vercel se request aa sake
app.use(cors());

// Render ke Environment Variables use karein, fallback ke liye localhost
const routes = {
    '/auth': process.env.AUTH_SERVICE_URL || 'http://localhost:5001',
    '/system': process.env.SYSTEM_SERVICE_URL || 'http://localhost:5005',
    '/audit': process.env.AUDIT_SERVICE_URL || 'http://localhost:5003',
    '/reports': process.env.REPORTS_SERVICE_URL || 'http://localhost:5004'
};

// Proxy setup
Object.entries(routes).forEach(([path, target]) => {
    app.use(path, createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite: { [`^${path}`]: '' }, // Ye '/auth/login' ko redirect karke Auth Service ko sirf '/login' bhejega
        onProxyReq: (proxyReq, req, res) => {
            console.log(`Gateway Redirecting: ${req.method} ${req.url} -> ${target}`);
        },
        onError: (err, req, res) => {
            console.error(`Gateway Error for ${path}:`, err.message);
            res.status(504).send('Gateway Timeout: Target service is unreachable.');
        }
    }));
});

// Port configuration (Render default 10000 use karta hai, code 8000 bol raha tha)
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`🚀 Omnicycle Gateway Operational: Port ${PORT}`);
    console.log(`Target Auth: ${routes['/auth']}`);
    console.log(`Target System: ${routes['/system']}`);
});