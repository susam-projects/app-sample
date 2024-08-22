import nextTick from "next-tick";
import { createRoot } from "react-dom/client";

import { App } from "@/app/App.tsx";

// Polyfill for @azure/service-bus as vite-plugin-node-polyfills doesn't include it
process.nextTick = nextTick;

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in the HTML file.",
  );
}
