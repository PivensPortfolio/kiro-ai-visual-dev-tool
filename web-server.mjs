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
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5174;

/**
 * Discover pages from the React project
 * @param {string} projectRoot - Path to the project root
 * @returns {Array} Array of page objects with path and name
 */
function discoverProjectPages(projectRoot) {
  const pages = [];
  
  try {
    // Check if this is a React project
    const packageJsonPath = path.join(projectRoot, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      return getDefaultPages();
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Add main React app page
    pages.push({
      path: 'http://localhost:5173',
      name: `${packageJson.name || 'React App'} - Main`
    });

    // Look for common React page patterns
    const srcDir = path.join(projectRoot, 'src');
    if (fs.existsSync(srcDir)) {
      
      // Check for pages directory
      const pagesDir = path.join(srcDir, 'pages');
      if (fs.existsSync(pagesDir)) {
        const pageFiles = fs.readdirSync(pagesDir)
          .filter(file => file.endsWith('.tsx') || file.endsWith('.jsx'))
          .filter(file => !file.startsWith('_')); // Exclude Next.js special files
        
        pageFiles.forEach(file => {
          const pageName = path.basename(file, path.extname(file));
          const routePath = pageName.toLowerCase() === 'home' || pageName.toLowerCase() === 'index' 
            ? '/' 
            : `/${pageName.toLowerCase()}`;
          
          pages.push({
            path: `http://localhost:5173${routePath}`,
            name: `${pageName} Page`
          });
        });
      }

      // Check for components that might be pages
      const componentsDir = path.join(srcDir, 'components');
      if (fs.existsSync(componentsDir)) {
        const componentFiles = fs.readdirSync(componentsDir)
          .filter(file => file.endsWith('.tsx') || file.endsWith('.jsx'))
          .filter(file => /page|screen|view/i.test(file));
        
        componentFiles.forEach(file => {
          const componentName = path.basename(file, path.extname(file));
          pages.push({
            path: `http://localhost:5173/${componentName.toLowerCase().replace(/page|screen|view/i, '')}`,
            name: `${componentName}`
          });
        });
      }
    }

    // Look for public HTML files
    const publicDir = path.join(projectRoot, 'public');
    if (fs.existsSync(publicDir)) {
      const htmlFiles = fs.readdirSync(publicDir)
        .filter(file => file.endsWith('.html') && file !== 'index.html');
      
      htmlFiles.forEach(file => {
        const pageName = path.basename(file, '.html');
        pages.push({
          path: `http://localhost:5173/${file}`,
          name: `${pageName} (Static)`
        });
      });
    }

    // If no pages found, return defaults
    if (pages.length === 0) {
      return getDefaultPages();
    }

    return pages;

  } catch (error) {
    console.error('Error in discoverProjectPages:', error);
    return getDefaultPages();
  }
}

/**
 * Get default pages when project discovery fails
 */
function getDefaultPages() {
  return [
    { path: 'http://localhost:5173', name: 'React App - Main' },
    { path: 'http://localhost:5174', name: 'AI Dev Tool' },
    { path: 'http://localhost:5174/mcp-test', name: 'MCP Test' }
  ];
}

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

// API endpoint to discover pages from the parent React project
app.get('/api/pages', (req, res) => {
  try {
    const projectRoot = path.join(__dirname, '..');
    const pages = discoverProjectPages(projectRoot);
    res.json(pages);
  } catch (error) {
    console.error('Error discovering pages:', error);
    res.status(500).json({ error: 'Failed to discover pages' });
  }
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
      '/api/pages': 'Project pages discovery',
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