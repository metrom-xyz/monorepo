import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react";
import { Theme } from "../types";

interface ThemeContext {
    theme: Theme;
    setTheme: (value: Theme) => void;
}

const ThemeContext = createContext<ThemeContext>({
    theme: Theme.Light,
    setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>(Theme.Light);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
