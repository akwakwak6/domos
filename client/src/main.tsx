import React from "react";
import { createRoot } from "react-dom/client";
import "./global.scss";
import Dashboard from "./dashboard";

const rootEl = document.getElementById("root");
if (!rootEl) {
    throw new Error("Root element #root not found");
}

createRoot(rootEl).render(
    <React.StrictMode>
        <Dashboard />
    </React.StrictMode>
);
