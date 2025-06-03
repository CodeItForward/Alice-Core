import React from "react";
import config from "../config.json";
import AliceApp from "../core/AliceApp.tsx";

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
    <AliceApp config={config} plugins={plugins} />
  );
}