import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/Osake.otf";
import { MetaMaskProvider } from "metamask-react";
import { Provider } from "react-redux";
import store from "./action/index";

ReactDOM.createRoot(document.getElementById("root")).render(
  <MetaMaskProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </MetaMaskProvider>
);
