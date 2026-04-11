const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// CORS allow karna zaroori hai taaki Vercel se request block na ho
app.use(cors());

// Render ke Environment Variables use karein
const routes = {
    '/auth': process.env.AUTH_SERVICE_URL || 'http://localhost:5001',
    '/system': process.env.SYSTEM_SERVICE_URL || 'http://localhost:5002',
    '/audit': process.env.AUDIT_SERVICE_URL || 'http://localhost:5003',
    '/reports': process.env.REPORTS_SERVICE_URL || 'http://localhost:5004'
};

// Proxy setup
Object.entries(routes).forEach(([path, target]) => {
    app.use(path, createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite: { [`^${path}`]: '' },
        // IMPORTANT: POST requests (Login/Add Item) ke liye ye fix zaroori hai
        onProxyReq: (proxyReq, req, res) => {
            if (req.body && Object.keys(req.body).length) {
                const bodyData = JSON.stringify(req.body);
                proxyReq.setHeader('Content-Type', 'application/json');
                proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                proxyReq.write(bodyData);
            }
        },
        onError: (err, req, res) => {
            console.error(`Gateway Error for ${path}:`, err.message);
            res.status(504).send('Gateway Timeout: Target service is unreachable.');
        }
    }));
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`🚀 Omnicycle Gateway Operational: Port ${PORT}`);
    console.log(`Target Auth: ${routes['/auth']}`);
    console.log(`Target System: ${routes['/system']}`);
});