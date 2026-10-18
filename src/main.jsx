import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AuthProvider from "./context/AuthProvider.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { MotionConfig } from "framer-motion";

import router from "./router/router.jsx";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <ThemeProvider>
            <MotionConfig reducedMotion="user">
                <AuthProvider>
                    <RouterProvider router={router} />
                    <ToastContainer
                        position="bottom-right"
                        autoClose={3000}
                        theme="light"
                        hideProgressBar={false}
                    />
                </AuthProvider>
            </MotionConfig>
        </ThemeProvider>
    </StrictMode>
);
