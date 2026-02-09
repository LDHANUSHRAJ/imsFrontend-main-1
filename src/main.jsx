import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.css";

console.log("Attempting to mount React app...");
try {
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
    console.log("React app mounted successfully.");
} catch (error) {
    console.error("Failed to mount React app:", error);
    document.body.innerHTML = `<div style="color:red; padding: 20px;"><h1>Critical Error</h1><pre>${error.message}</pre></div>`;
}

