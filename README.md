# Alice Copilot

Alice Copilot is a modern, plugin-based AI assistant built with React and TypeScript. It features a modular architecture that allows for easy extension through plugins, centralized configuration, and integrated chat functionality with OpenAI support.

---

## 🏗️ Architecture Overview

Alice Copilot follows a **plugin-first architecture** where the core application provides the foundation, and plugins extend functionality through routes and navigation.

### Key Features
- 🔌 **Plugin System**: Modular architecture for easy feature extension
- 🤖 **AI Integration**: Built-in OpenAI API support for chat functionality
- 🎨 **Modern UI**: Clean, responsive interface built with Tailwind CSS
- 🧭 **Dynamic Routing**: Automatic route registration from plugins
- ⚙️ **Centralized Config**: JSON-based configuration management
- 📱 **Responsive Design**: Mobile-first design with sidebar navigation

---

## 📁 Project Structure

```
Alice-Core/
├── src/                      # Application Bootstrap
│   ├── main.tsx             # Vite entry point
│   ├── App.tsx              # App configuration & plugin loading
│   ├── index.css            # Global styles (Tailwind)
│   └── vite-env.d.ts        # Vite TypeScript definitions
├── core/                     # Core Application Logic
│   ├── AliceApp.tsx         # Main app component & plugin host
│   ├── context/             # React contexts
│   │   └── MessageContext.tsx
│   ├── types/               # TypeScript type definitions
│   │   └── message.ts
│   ├── ui/                  # Reusable UI components
│   │   ├── Logo.tsx
│   │   └── UserDropdown.tsx
│   ├── layout/              # Layout components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── MainLayout.tsx
│   └── chat/                # Chat functionality
│       ├── ChatContainer.tsx
│       ├── Message.tsx
│       ├── MessageInput.tsx
│       └── MessageList.tsx
├── plugins/                  # Plugin System
│   └── sample-plugin/
│       └── index.tsx        # Sample plugin implementation
├── config.json              # Application configuration
└── package.json             # Dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Alice-Core
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure the application**
   
   Update `config.json` with your settings:
   ```json
   {
     "siteName": "Alice Copilot",
     "openAIApiKey": "your-openai-api-key-here",
     "theme": "default"
   }
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   
   Navigate to `http://localhost:5173`

---

## 🔌 Plugin Development

### Creating a Plugin

Plugins are self-contained modules that extend Alice's functionality. Here's how to create one:

1. **Create plugin directory**
   ```bash
   mkdir plugins/my-plugin
   ```

2. **Create plugin definition**
   ```typescript
   // plugins/my-plugin/index.tsx
   import React from "react";

   export default {
     name: "My Plugin",
     navLinks: [
       { label: "My Feature", path: "/my-feature" }
     ],
     routes: [
       { 
         path: "/my-feature", 
         component: () => <div>My Plugin Page!</div> 
       }
     ]
   };
   ```

3. **Register the plugin**
   ```typescript
   // src/App.tsx
   import myPlugin from "../plugins/my-plugin/index.tsx";
   
   const plugins = [samplePlugin, myPlugin];
   ```

### Plugin Structure

Each plugin exports an object with:
- **`name`**: Display name for the plugin
- **`navLinks`**: Array of navigation links to add to sidebar
- **`routes`**: Array of React Router routes to register

---

## ⚙️ Configuration

### config.json

The application uses a centralized configuration file:

```json
{
  "siteName": "Alice Copilot",
  "openAIApiKey": "your-openai-api-key",
  "theme": "default"
}
```

### Environment Variables

For production deployments, consider using environment variables:
- `OPENAI_API_KEY`: Your OpenAI API key
- `VITE_SITE_NAME`: Application name

---

## 🤖 AI Integration

Alice includes built-in support for OpenAI's API:

1. **Set your API key** in `config.json`
2. **Chat interface** automatically uses the configured key
3. **Message context** maintains conversation history
4. **Extensible** - easy to add other AI providers

---

## 🎨 Styling & Theming

- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Dark Mode Ready**: Theme system in place
- **Custom Components**: Reusable UI components in `core/ui/`

---

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Tech Stack

- **Frontend**: React 18 + TypeScript
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Package Manager**: npm

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy Options

- **Vercel**: Connect your GitHub repo for automatic deployments
- **Netlify**: Drag and drop the `dist` folder
- **Azure Static Web Apps**: Use the Azure CLI
- **GitHub Pages**: Use GitHub Actions for CI/CD

### Environment Setup

1. Set environment variables for your deployment platform
2. Update `config.json` or use environment variable substitution
3. Ensure your OpenAI API key is securely stored

---

## 🔒 Security Notes

- **API Keys**: Never commit real API keys to version control
- **Environment Variables**: Use secure environment variable storage
- **Config Files**: Consider adding `config.json` to `.gitignore` for production
- **HTTPS**: Always use HTTPS in production

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Plugin Contributions

We welcome plugin contributions! Please:
- Follow the plugin structure guidelines
- Include documentation for your plugin
- Test your plugin thoroughly
- Submit plugins as separate directories in `plugins/`

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🆘 Support

- **Issues**: Report bugs and request features via GitHub Issues
- **Documentation**: Check the `/docs` folder for detailed guides
- **Community**: Join our discussions in GitHub Discussions

---

## 🎯 Roadmap

- [ ] Plugin marketplace and discovery
- [ ] Advanced AI model support (Claude, Gemini)
- [ ] Real-time collaboration features
- [ ] Advanced theming system
- [ ] Plugin sandboxing and security
- [ ] Performance monitoring and analytics
