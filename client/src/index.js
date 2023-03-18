import React from "react";
import ReactDOM from "react-dom/client";
import { Router } from "react-router-dom";

import "./index.css";
import history from "./app/utils/history";

import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Router history={history}>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </Router>
);
