# 🎯 Kiro AI Visual Dev Tool

A powerful visual development tool that enables AI-assisted element inspection and modification for web applications. Now with **full cross-origin support** for external applications!

## ✨ Features

### 🌐 Cross-Origin Application Support
- **Works with any web application** - React, Vue, Angular, vanilla HTML
- **Secure postMessage communication** for cross-origin element selection
- **No CORS issues** - Tool communicates safely across different origins
- **Lightweight integration** - Single script inclusion

### 🎯 Advanced Element Selection
- **Visual element inspection** with hover and selection highlights
- **Persistent selection borders** that scroll with content
- **Smart floating prompt** positioned perfectly below selected elements
- **Comprehensive element data** - tagName, classes, content, dimensions

### 🤖 AI Integration
- **Direct Kiro AI communication** via MCP (Model Context Protocol)
- **Element context awareness** - AI receives full element information
- **Natural language prompts** for element modifications
- **Real-time style editing** with visual feedback

## 🚀 Quick Start

### For External Applications (React, Vue, etc.)

1. **Add the inspector script** to your application's HTML:
```html
<script src="/kiro-inspector.js"></script>
```

2. **Start the AI Visual Dev Tool** (runs on http://localhost:5174)

3. **Select your application** from the dropdown (e.g., http://localhost:5173)

4. **Click "Start Inspector"** and begin selecting elements!

### For Same-Origin Applications

The tool works automatically with same-origin content - no additional setup required.

## 📋 Installation

### Option 1: Clone Repository
```bash
git clone https://github.com/your-username/kiro-ai-visual-dev-tool.git
cd kiro-ai-visual-dev-tool
```

### Option 2: Download Release
Download the latest release and extract to your project.

## 🔧 Setup

1. **Place the tool** in your project directory
2. **Copy `kiro-inspector.js`** to your application's public folder
3. **Include the script** in your application's HTML
4. **Start your application** (e.g., React dev server on localhost:5173)
5. **Open the tool** by navigating to the `ai-dev-tool.html` file

## 📖 Usage Guide

### Starting Inspection

1. **Open the AI Visual Dev Tool** in your browser
2. **Select your application URL** from the dropdown
3. **Click "Start Inspector"** - the button will turn red and show "Stop Inspector"
4. **Hover over elements** to see blue highlighting
5. **Click elements** to select them and open the floating prompt

### Using the Floating Prompt

When you select an element, a floating prompt appears with:

- **Element preview** - Shows tag, classes, and content
- **Quick prompt input** - Ask for changes in natural language
- **Style controls** - Visual editors for spacing, colors, typography
- **CSS class editor** - For utility frameworks like Tailwind CSS

### AI Integration

The tool integrates with Kiro AI through MCP:

1. **Send prompts** directly to Kiro with full element context
2. **Receive AI suggestions** for improvements and modifications
3. **Apply changes** with AI assistance

## 🎨 Visual Feedback

### Highlight Types
- **Hover Highlight** - Blue inset shadow when hovering over elements
- **Selection Highlight** - Blue outline border for selected elements
- **Persistent Selection** - Selected element stays highlighted when moving mouse

### Floating Prompt Positioning
- **8px spacing** below selected elements
- **Horizontally centered** to the selected element
- **Smart positioning** - moves above element only when necessary
- **Scrolls naturally** with page content

## 🔧 Technical Details

### Cross-Origin Communication
The tool uses `postMessage` API for secure cross-origin communication:

```javascript
// Tool sends inspector state to iframe
iframe.contentWindow.postMessage({
    type: 'SET_INSPECTOR_STATE',
    isInspecting: true
}, '*');

// Iframe sends element data back to tool
window.parent.postMessage({
    type: 'ELEMENT_SELECTED',
    element: elementData
}, 'http://localhost:5174');
```

### Inspector Script (`kiro-inspector.js`)
Lightweight script that:
- Listens for inspector state changes
- Handles element selection and highlighting
- Sends element data to the parent tool
- Manages visual feedback (hover/selection highlights)

### Coordinate System
- **Cross-origin elements** - Uses iframe viewport coordinates directly
- **Same-origin elements** - Adjusts coordinates for iframe positioning
- **Boundary detection** - Smart positioning within visible area

## 🧪 Testing

### Test with React Application

1. **Start React app** on http://localhost:5173
2. **Include inspector script** in `public/index.html`
3. **Open AI tool** and select React app from dropdown
4. **Test element selection** and floating prompt positioning

### Test Cross-Origin Functionality

1. **Verify postMessage communication** in browser console
2. **Test element highlighting** (hover vs selection)
3. **Confirm floating prompt positioning** (8px below, centered)
4. **Test inspector state management** (start/stop)

## 🐛 Troubleshooting

### Inspector Not Working
- **Check console** for postMessage communication logs
- **Verify script inclusion** - `kiro-inspector.js` must be loaded
- **Confirm origin** - Tool runs on http://localhost:5174

### Positioning Issues
- **Check coordinate logs** in browser console
- **Verify iframe dimensions** and positioning
- **Test with different element types** and positions

### Highlighting Problems
- **Hover highlights** use `box-shadow` (temporary)
- **Selection highlights** use `outline` (persistent)
- **Check for CSS conflicts** with existing styles

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with cross-origin applications
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Built for Kiro AI development workflows
- Inspired by browser developer tools
- Designed for modern web application development

---

**Ready to supercharge your development workflow with AI-assisted visual editing!** 🚀