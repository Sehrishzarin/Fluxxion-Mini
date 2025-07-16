import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CRMProvider } from "./context/CRMContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CRMProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CRMProvider>
  </React.StrictMode>
);
