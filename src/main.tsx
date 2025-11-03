import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// @ts-ignore
import "./output.css";
import App from "./App.js";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
