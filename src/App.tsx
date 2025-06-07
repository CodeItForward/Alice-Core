import React from "react";
import config from "../config.json";
import AliceApp from "../core/AliceApp.tsx";
import { AuthProvider } from "../core/context/AuthContext";
import AuthGate from './AuthGate';

const openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY;

async function loadPlugins(pluginNames: string[]) {
  const pluginModules = await Promise.all(
    pluginNames.map(name => import(`../plugins/${name}/index.tsx`))
  );
  return pluginModules.map(mod => mod.default);
}

export default function App() {
  const [plugins, setPlugins] = React.useState<any[]>([]);

  React.useEffect(() => {
    loadPlugins(config.plugins || []).then(setPlugins);
  }, []);

  if (!plugins.length) return <div>Loading plugins...</div>;

  return (
    <AuthProvider>
      <AuthGate>
        <AliceApp config={{ ...config, openAIApiKey }} plugins={plugins} />
      </AuthGate>
    </AuthProvider>
  );
}