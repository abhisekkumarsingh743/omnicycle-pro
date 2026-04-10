const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(cors());

const routes = {
    '/auth': 'http://localhost:5001',
    '/audit': 'http://localhost:5003',
    '/reports': 'http://localhost:5004',
    '/system': 'http://localhost:5005'
};

Object.entries(routes).forEach(([path, target]) => {
    app.use(path, createProxyMiddleware({ 
        target, 
        changeOrigin: true,
        pathRewrite: { [`^${path}`]: '' } 
    }));
});

app.listen(8000, () => console.log('🛡️ Omnicycle Gateway: Port 8000'));