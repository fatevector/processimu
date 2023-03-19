import React from "react";
import ReactDOM from "react-dom/client";
import { Router } from "react-router-dom";
import { Provider } from "react-redux";

import "./index.css";
import history from "./app/utils/history";

import App from "./App";
import { createStore } from "./app/store/createStore";

const store = createStore();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Router history={history}>
        <React.StrictMode>
            <Provider store={store}>
                <App />
            </Provider>
        </React.StrictMode>
    </Router>
);
