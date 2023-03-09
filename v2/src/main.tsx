import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./themeContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ThemeProvider initialTheme='dark'>
    <div className="bg-light dark:bg-dark">
      <App />
    </div>
  </ThemeProvider>
);
