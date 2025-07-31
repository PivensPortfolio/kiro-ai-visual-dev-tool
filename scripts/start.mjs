#!/usr/bin/env node

/**
 * Start script for Kiro AI Visual Dev Tool
 * Starts both MCP server and web server
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function startServer(script, name, color) {
  const process = spawn('node', [script], {
    cwd: path.dirname(__dirname),
    stdio: 'pipe'
  });

  process.stdout.on('data', (data) => {
    console.log(`${color}[${name}]${'\x1b[0m'} ${data.toString().trim()}`);
  });

  process.stderr.on('data', (data) => {
    console.log(`${color}[${name}]${'\x1b[0m'} ${data.toString().trim()}`);
  });

  process.on('close', (code) => {
    console.log(`${color}[${name}]${'\x1b[0m'} Process exited with code ${code}`);
  });

  return process;
}

console.log('🚀 Starting Kiro AI Visual Dev Tool...');
console.log('');

// Start MCP server
const mcpServer = startServer('mcp-server.mjs', 'MCP', '\x1b[36m'); // Cyan

// Start web server  
const webServer = startServer('web-server.mjs', 'WEB', '\x1b[32m'); // Green

// Handle shutdown
process.on('SIGINT', () => {
  console.log('\\n🛑 Shutting down servers...');
  mcpServer.kill();
  webServer.kill();
  process.exit(0);
});

console.log('✅ Both servers started!');
console.log('📱 AI Dev Tool: http://localhost:5174/ai-dev-tool');
console.log('🧪 MCP Test: http://localhost:5174/mcp-test');
console.log('📊 MCP Status: http://localhost:3001/status');
console.log('');
console.log('Press Ctrl+C to stop all servers');