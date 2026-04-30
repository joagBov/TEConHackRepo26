import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./style.css";
import { RageProvider } from "./context/RageContext";
import { startTracker } from "./hooks/useTracker";  

startTracker();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RageProvider>
      <App />
    </RageProvider>
  </React.StrictMode>
);