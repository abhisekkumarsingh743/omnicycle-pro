const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

app.use(cors());

const routes = {
    '/auth': process.env.AUTH_SERVICE_URL,
    '/system': process.env.SYSTEM_SERVICE_URL,
    '/audit': process.env.AUDIT_SERVICE_URL,
    '/reports': process.env.REPORTS_SERVICE_URL
};

Object.entries(routes).forEach(([path, target]) => {
    if (target) {
        app.use(path, createProxyMiddleware({
            target,
            changeOrigin: true,
            pathRewrite: { [`^${path}`]: '' },
            proxyTimeout: 120000,
            onProxyReq: (proxyReq, req, res) => {
                // Fix: Ensure JSON body is forwarded correctly
                if (req.body && Object.keys(req.body).length) {
                    const bodyData = JSON.stringify(req.body);
                    proxyReq.setHeader('Content-Type', 'application/json');
                    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                    proxyReq.write(bodyData);
                }
            },
            onError: (err, req, res) => {
                res.status(502).json({ error: "Service Warm-up Required", status: "reconnecting" });
            }
        }));
    }
});

app.listen(process.env.PORT || 8000, () => console.log("Gateway Live"));