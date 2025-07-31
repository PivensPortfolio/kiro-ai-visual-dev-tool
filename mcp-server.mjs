#!/usr/bin/env node

/**
 * Kiro AI Visual Dev Tool - MCP Server
 * 
 * Handles browser-to-Kiro communication via:
 * 1. HTTP endpoints for browser messages
 * 2. MCP tools for Kiro integration
 * 3. File-based message storage
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema
} from '@modelcontextprotocol/sdk/types.js';
import { promises as fs } from 'fs';
import { createServer } from 'http';
import path from 'path';

const INCOMING_FILE = '.kiro/browser-messages/incoming.json';
const HISTORY_FILE = '.kiro/browser-messages/browser-messages.json';

// Ensure directories exist
async function ensureDirectories() {
  try {
    await fs.mkdir('.kiro/browser-messages', { recursive: true });
    
    // Initialize files if they don't exist
    try {
      await fs.access(INCOMING_FILE);
    } catch {
      await fs.writeFile(INCOMING_FILE, '[]');
    }
    
    try {
      await fs.access(HISTORY_FILE);
    } catch {
      await fs.writeFile(HISTORY_FILE, '[]');
    }
  } catch (error) {
    console.error('Error ensuring directories:', error);
  }
}

// Create MCP Server
const server = new Server(
  {
    name: 'kiro-ai-visual-dev-tool',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {
        listChanged: true
      }
    }
  }
);

// Register MCP tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get-latest-browser-message',
        description: 'Get the latest browser message from the queue',
        inputSchema: {
          type: 'object',
          properties: {
            count: {
              type: 'number',
              description: 'Number of recent messages to retrieve (default: 1)',
              default: 1
            }
          },
          required: []
        }
      },
      {
        name: 'send-browser-message',
        description: 'Send a message from browser to message queue',
        inputSchema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'The message from browser'
            },
            source: {
              type: 'string',
              description: 'Source of the message'
            }
          },
          required: ['message']
        }
      }
    ]
  };
});

// Handle MCP tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'get-latest-browser-message') {
    try {
      const data = await fs.readFile(INCOMING_FILE, 'utf8');
      const messages = JSON.parse(data || '[]');
      
      if (messages.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: '📭 No browser messages available'
            }
          ]
        };
      }
      
      const count = args?.count || 1;
      const recentMessages = messages.slice(-count);
      
      let response = `🎯 **Latest Browser Message${count > 1 ? 's' : ''}**\n\n`;
      
      recentMessages.forEach((msg, index) => {
        if (count > 1) response += `**Message ${index + 1}:**\n`;
        response += `**Content**: ${msg.message}\n`;
        response += `**From**: ${msg.source}\n`;
        response += `**ID**: ${msg.id}\n`;
        response += `**Time**: ${msg.timestamp}\n`;
        if (msg.metadata?.url) response += `**URL**: ${msg.metadata.url}\n`;
        response += `\n---\n\nUser said: "${msg.message}"\n\n`;
      });
      
      return {
        content: [
          {
            type: 'text',
            text: response
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ Error reading browser messages: ${error.message}`
          }
        ]
      };
    }
  }

  if (name === 'send-browser-message') {
    const { message, source = 'mcp-tool' } = args;

    const messageObj = {
      id: `mcp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message,
      source,
      timestamp: new Date().toISOString(),
      processed: false
    };

    try {
      // Read existing messages
      let messages = [];
      try {
        const data = await fs.readFile(INCOMING_FILE, 'utf8');
        messages = JSON.parse(data || '[]');
      } catch (error) {
        messages = [];
      }

      // Add new message
      messages.push(messageObj);

      // Write back to file
      await fs.writeFile(INCOMING_FILE, JSON.stringify(messages, null, 2));

      return {
        content: [
          {
            type: 'text',
            text: `✅ Message added to queue\n\n**Message**: ${message}\n**Source**: ${source}\n**ID**: ${messageObj.id}`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ Error sending message: ${error.message}`
          }
        ]
      };
    }
  }

  throw new Error(`Unknown tool: ${name}`);
});

// Start MCP Server
const transport = new StdioServerTransport();
server.connect(transport);

// Start HTTP Server for browser communication
const httpServer = createServer(async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'running',
      name: 'Kiro AI Visual Dev Tool MCP Server',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    }));
    return;
  }

  if (req.method === 'POST' && (req.url === '/send-message' || req.url === '/test-message')) {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);

        const messageObj = {
          id: `http_${Date.now()}`,
          message: data.message || 'No message provided',
          source: data.source || 'http-browser',
          metadata: data.metadata || {},
          timestamp: new Date().toISOString(),
          processed: false
        };

        // Read existing messages
        let messages = [];
        try {
          const data = await fs.readFile(INCOMING_FILE, 'utf8');
          messages = JSON.parse(data || '[]');
        } catch (error) {
          messages = [];
        }

        // Add new message
        messages.push(messageObj);

        // Write to incoming messages
        await fs.writeFile(INCOMING_FILE, JSON.stringify(messages, null, 2));

        console.error(`🎯 Browser Message: ${messageObj.message}`);
        console.error(`📝 Source: ${messageObj.source}`);
        console.error(`🔗 ID: ${messageObj.id}`);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: `Message stored successfully`,
          messageId: messageObj.id,
          timestamp: messageObj.timestamp
        }));

      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: error.message
        }));
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

// Initialize and start
await ensureDirectories();

const HTTP_PORT = 3001;
httpServer.listen(HTTP_PORT, () => {
  console.error(`🚀 Kiro AI Visual Dev Tool MCP Server started!`);
  console.error(`🔗 MCP Protocol: Connected via stdin/stdout`);
  console.error(`🌐 HTTP Server: http://localhost:${HTTP_PORT}`);
  console.error(`📁 Messages: ${INCOMING_FILE}`);
  console.error(`✅ Ready to receive browser messages!`);
});