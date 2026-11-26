import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";

import useAuthStore from "./store/authStore";

import { setupInterceptors } from "./api/axios";

import "./index.css";


const cleanupInterceptors = setupInterceptors(useAuthStore);


if (import.meta.hot) {

    import.meta.hot.dispose(cleanupInterceptors);

}


createRoot(document.getElementById("root")).render(

    <StrictMode>

        <BrowserRouter>

            <App />

        </BrowserRouter>

    </StrictMode>

);