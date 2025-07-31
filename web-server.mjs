#!/usr/bin/env node

/**
 * Kiro AI Visual Dev Tool - Web Server
 * 
 * Serves the AI Visual Development Tool interface
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5173;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/ai-dev-tool', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'ai-dev-tool.html'));
});

app.get('/mcp-test', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mcp-test.html'));
});

app.get('/status', (req, res) => {
  res.json({
    status: 'running',
    name: 'Kiro AI Visual Dev Tool Web Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      '/': 'Main AI Visual Dev Tool',
      '/ai-dev-tool': 'AI Visual Dev Tool interface',
      '/mcp-test': 'MCP message testing page',
      '/status': 'Server status'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🌐 Kiro AI Visual Dev Tool Web Server running on http://localhost:${PORT}`);
  console.log(`📱 AI Dev Tool: http://localhost:${PORT}/ai-dev-tool`);
  console.log(`🧪 MCP Test: http://localhost:${PORT}/mcp-test`);
  console.log(`📊 Status: http://localhost:${PORT}/status`);
});