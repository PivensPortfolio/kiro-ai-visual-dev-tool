# Kiro AI Visual Dev Tool Bundle

**A complete AI-powered visual development tool** that bridges your browser with Kiro IDE's AI capabilities.

This bundle provides:
- 🎯 **Visual Element Inspector** - Click and analyze any element on any webpage
- 🤖 **AI-Powered Analysis** - Send element context and prompts to Kiro's AI
- 🔗 **Seamless Integration** - Direct communication bridge with Kiro IDE
- 📝 **Context-Aware Prompts** - Include element details, page context, and custom instructions

## 🚀 Quick Setup

1. **Copy this entire folder** to your project root
2. **Install dependencies**: `npm install` (in the bundle folder)
3. **Configure MCP**: Add the server to your `.kiro/settings/mcp.json`
4. **Start the servers**: Run `npm run start`
5. **Open the tool**: Navigate to `http://localhost:5173/ai-dev-tool`

## 📁 What's Included

```
kiro-ai-visual-dev-tool/
├── package.json                    # Dependencies and scripts
├── mcp-server.mjs                  # MCP server for Kiro integration
├── web-server.mjs                  # Web server for the AI tool
├── public/
│   ├── index.html                  # Main AI Visual Dev Tool interface
│   ├── mcp-test.html              # Browser message testing page
│   └── assets/                     # CSS, JS, and other assets
├── .kiro/
│   ├── browser-messages/           # Message storage
│   │   ├── incoming.json          # Incoming messages from browser
│   │   └── browser-messages.json  # Message history log
│   └── hooks/
│       └── browser-message-responder.kiro.hook  # Manual message processor
└── scripts/
    ├── setup.mjs                   # One-time setup script
    └── start.mjs                   # Start all services
```

## ⚙️ Configuration

### MCP Server Configuration

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

## 🎯 Usage

### 1. AI Visual Dev Tool (Main Interface)
- Open `http://localhost:5173/ai-dev-tool`
- Load any webpage in the built-in browser
- Use the visual inspector to select elements
- Write AI prompts with full element context
- Send to Kiro for AI-powered analysis and suggestions

### 2. Element Analysis Workflow
1. **Load Page** - Enter any URL to analyze
2. **Start Inspector** - Click to enable element selection
3. **Select Element** - Click any element to capture its context
4. **Write Prompt** - Describe what you want to do with the element
5. **Send to Kiro** - AI processes with full context

### 3. Message Testing
- Open `http://localhost:5173/mcp-test`
- Send test messages directly to Kiro
- Verify the communication pipeline

### 4. Kiro Integration
- Messages appear in `.kiro/browser-messages/incoming.json`
- Manually trigger the "Browser Message Responder" hook in Kiro
- Messages appear in Kiro chat with full element context and metadata

## 🔧 Commands

```bash
# Install dependencies
npm install

# Start all services (MCP server + Web server)
npm run start

# Start only MCP server
npm run start:mcp

# Start only web server  
npm run start:web

# Run setup (copies hooks and creates directories)
npm run setup
```

## 🏗️ Architecture

```
Browser AI Tool → HTTP POST → MCP Server → .kiro/browser-messages/incoming.json
                                              ↓
                                         Manual Hook Trigger
                                              ↓
                                         Kiro Chat Interface
```

## 📋 Requirements

- Node.js 18+
- Kiro IDE with MCP support
- Project with `.kiro/` directory

## 🔍 Troubleshooting

### Messages not appearing in Kiro?
1. Check MCP server is running: `http://localhost:3001/status`
2. Verify MCP configuration in `.kiro/settings/mcp.json`
3. Manually trigger the Browser Message Responder hook

### Web tool not loading?
1. Check web server is running: `http://localhost:5173`
2. Verify no port conflicts
3. Check browser console for errors

### MCP server connection issues?
1. Restart Kiro IDE
2. Check MCP server logs
3. Verify file permissions in `.kiro/` directory

## 🎨 Customization

### Adding Custom Tools
Edit `mcp-server.mjs` to add new MCP tools:

```javascript
{
  name: 'your-custom-tool',
  description: 'Your tool description',
  inputSchema: { /* your schema */ }
}
```

### Styling the Interface
Edit `public/assets/style.css` to customize the appearance.

### Message Processing
Modify `.kiro/hooks/browser-message-responder.kiro.hook` to change how messages are processed.

## 📦 Deployment

This tool is designed for local development. For production use:

1. Change ports in configuration
2. Add authentication if needed
3. Configure CORS for your domain
4. Set up proper logging

## 🤝 Contributing

This is a self-contained bundle. To contribute:

1. Make changes to the bundle
2. Test with multiple projects
3. Update documentation
4. Create new bundle version

---

**Version**: 1.0.0  
**Compatible with**: Kiro IDE 0.1.25+  
**License**: MIT