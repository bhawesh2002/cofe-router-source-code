// Simple Node.js server with proxy for router API
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require("path");

const app = express();
const PORT = 8080;

// Serve static files
app.use(express.static(path.join(__dirname)));

// Proxy /goform requests to router (change IP as needed)
app.use(
  "/goform",
  createProxyMiddleware({
    target: "http://192.168.150.1", // Router IP
    changeOrigin: true,
  })
);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
