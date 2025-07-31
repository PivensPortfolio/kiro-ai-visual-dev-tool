# 🚀 Kiro AI Visual Dev Tool - Setup Guide

## Quick Start (5 minutes)

### 1. Copy to Your Project
```bash
# Copy the entire kiro-ai-visual-dev-tool folder to your project root
cp -r kiro-ai-visual-dev-tool /path/to/your/project/
cd /path/to/your/project/kiro-ai-visual-dev-tool
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Setup
```bash
npm run setup
```

### 4. Configure MCP Server
Add this to your project's `.kiro/settings/mcp.json`:

```json
{
  "mcpServers": {
    "ai-visual-dev-tool": {
      "command": "node",
      "args": ["kiro-ai-visual-dev-tool/mcp-server.mjs"],
      "env": {},
      "disabled": false,
      "autoApprove": ["get-latest-browser-message", "send-browser-message"]
    }
  }
}
```

### 5. Start the Tool
```bash
npm run start
```

### 6. Test It
1. Open `http://localhost:5173/mcp-test`
2. Send a test message
3. In Kiro, manually trigger "Browser Message Responder" hook
4. Your message should appear in Kiro chat!

## 📁 File Structure After Setup

```
your-project/
├── .kiro/
│   ├── settings/
│   │   └── mcp.json                    # ← Add MCP server config here
│   ├── browser-messages/
│   │   ├── incoming.json               # ← Messages from browser
│   │   └── browser-messages.json      # ← Message history
│   └── hooks/
│       └── browser-message-responder.kiro.hook  # ← Manual trigger hook
└── kiro-ai-visual-dev-tool/
    ├── package.json
    ├── mcp-server.mjs                  # ← MCP server
    ├── web-server.mjs                  # ← Web interface
    └── public/
        ├── index.html                  # ← Main interface
        └── mcp-test.html              # ← Testing page
```

## 🎯 Usage Workflow

### Sending Messages
1. **Browser** → Send message via web interface
2. **MCP Server** → Stores message in `.kiro/browser-messages/incoming.json`
3. **You** → Manually trigger "Browser Message Responder" hook in Kiro
4. **Kiro** → Processes message and responds in chat
5. **System** → Logs processed message to history

### Available Endpoints
- `http://localhost:5173/` - Main interface
- `http://localhost:5173/mcp-test` - Testing page
- `http://localhost:3001/status` - MCP server status

## 🔧 Customization

### Change Ports
Edit the port numbers in:
- `mcp-server.mjs` (line ~200): `const HTTP_PORT = 3001;`
- `web-server.mjs` (line ~10): `const PORT = 5174;`

### Modify Message Processing
Edit `.kiro/hooks/browser-message-responder.kiro.hook` to change how messages are processed.

### Add Custom Tools
Edit `mcp-server.mjs` to add new MCP tools for Kiro integration.

## 🐛 Troubleshooting

### "Connection Failed" Error
- Check if MCP server is running: `http://localhost:3001/status`
- Verify MCP configuration in `.kiro/settings/mcp.json`
- Restart Kiro IDE to reload MCP configuration

### Messages Not Appearing in Kiro
- Manually trigger the "Browser Message Responder" hook
- Check `.kiro/browser-messages/incoming.json` for messages
- Verify hook file exists and is enabled

### Port Conflicts
- Change ports in configuration files
- Kill existing processes: `pkill -f "node.*mcp-server"`

### Permission Issues
- Ensure `.kiro/` directory is writable
- Check file permissions: `chmod -R 755 .kiro/`

## 📦 Distribution

To share this tool with others:

1. **Zip the bundle**: `zip -r kiro-ai-visual-dev-tool.zip kiro-ai-visual-dev-tool/`
2. **Share instructions**: Include this SETUP.md file
3. **Version control**: Tag releases for easy distribution

## 🔄 Updates

To update the tool:

1. Replace the `kiro-ai-visual-dev-tool/` folder
2. Run `npm install` to update dependencies
3. Restart the servers: `npm run start`
4. No need to reconfigure MCP settings

---

**Need help?** Check the main README.md for detailed documentation.