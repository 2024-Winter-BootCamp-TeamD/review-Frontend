import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ExtensionApp from "./ExtensionApp.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ExtensionApp />
  </StrictMode>
);
