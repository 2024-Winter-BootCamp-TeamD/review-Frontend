import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import ExtensionApp from "./ExtensionApp.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ExtensionApp />
  </StrictMode>
);
