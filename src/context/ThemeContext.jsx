import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({ dark: false, toggleTheme: () => {} });
const STORAGE_KEY = "tb-theme";

const readSavedTheme = () => {
    try {
        return localStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
};

const saveTheme = (theme) => {
    try {
        localStorage.setItem(STORAGE_KEY, theme);
        return true;
    } catch {
        return false;
    }
};

const getInitialTheme = () => {
    const saved = readSavedTheme();
    if (saved) return saved === "dark";
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
};

export const ThemeProvider = ({ children }) => {
    const [dark, setDark] = useState(getInitialTheme);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", dark);
        saveTheme(dark ? "dark" : "light");
    }, [dark]);

    const toggleTheme = () => setDark((d) => !d);

    return <ThemeContext.Provider value={{ dark, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
