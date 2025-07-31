#!/usr/bin/env node

/**
 * Setup script for Kiro AI Visual Dev Tool
 * Creates necessary directories and files
 */

import { promises as fs } from 'fs';
import path from 'path';

async function setup() {
  console.log('🚀 Setting up Kiro AI Visual Dev Tool...');

  try {
    // Create .kiro directories
    await fs.mkdir('.kiro/browser-messages', { recursive: true });
    await fs.mkdir('.kiro/hooks', { recursive: true });
    console.log('✅ Created .kiro directories');

    // Create message files
    const incomingFile = '.kiro/browser-messages/incoming.json';
    const historyFile = '.kiro/browser-messages/browser-messages.json';

    try {
      await fs.access(incomingFile);
      console.log('📄 incoming.json already exists');
    } catch {
      await fs.writeFile(incomingFile, '[]');
      console.log('✅ Created incoming.json');
    }

    try {
      await fs.access(historyFile);
      console.log('📄 browser-messages.json already exists');
    } catch {
      await fs.writeFile(historyFile, '[]');
      console.log('✅ Created browser-messages.json');
    }

    // Create hook file
    const hookFile = '.kiro/hooks/browser-message-responder.kiro.hook';
    const hookContent = {
      "enabled": true,
      "name": "Browser Message Responder",
      "description": "Manually triggered hook to process browser messages",
      "version": "1.0.0",
      "when": {
        "type": "manual"
      },
      "then": {
        "type": "askAgent",
        "userInput": "Read the latest browser message from .kiro/browser-messages/incoming.json and respond to it as if the user sent it directly to you. Also append the message to .kiro/browser-messages/browser-messages.json for logging."
      }
    };

    try {
      await fs.access(hookFile);
      console.log('🪝 Hook file already exists');
    } catch {
      await fs.writeFile(hookFile, JSON.stringify(hookContent, null, 2));
      console.log('✅ Created browser-message-responder hook');
    }

    // Check for MCP configuration
    const mcpConfigFile = '.kiro/settings/mcp.json';
    try {
      await fs.access(mcpConfigFile);
      console.log('⚙️ MCP config exists - please add the server manually');
    } catch {
      console.log('⚠️ No MCP config found - you\'ll need to create .kiro/settings/mcp.json');
    }

    console.log('\\n🎉 Setup complete!');
    console.log('\\n📋 Next steps:');
    console.log('1. Add MCP server to .kiro/settings/mcp.json');
    console.log('2. Run: npm run start');
    console.log('3. Open: http://localhost:5173/ai-dev-tool');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

setup();