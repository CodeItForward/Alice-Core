import React from "react";
import config from "../config.json";
import AliceApp from "../core/AliceApp.tsx";
import samplePlugin from "../plugins/sample-plugin/index.tsx";

const plugins = [samplePlugin];

export default function App() {
  return (
    <AliceApp config={config} plugins={plugins} />
  );
}