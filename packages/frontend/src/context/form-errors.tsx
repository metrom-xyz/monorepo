import {
    createContext,
    useCallback,
    useContext,
    useState,
    type ReactNode,
} from "react";

export interface FormErrors {
    basics?: string;
    rewards?: string;
    restrictions?: string;
}

interface FormErrorsContextValue {
    errors: FormErrors;
    updateErrors: (errors: Partial<FormErrors>) => void;
}

const FormErrorsContext = createContext<FormErrorsContextValue | null>(null);

export function FormErrorsProvider({ children }: { children: ReactNode }) {
    const [errors, setErrors] = useState<FormErrors>({});

    const updateErrors = useCallback((newErrors: Partial<FormErrors>) => {
        setErrors((prev) => ({ ...prev, ...newErrors }));
    }, []);

    return (
        <FormErrorsContext.Provider value={{ errors, updateErrors }}>
            {children}
        </FormErrorsContext.Provider>
    );
}

export function useFormErrors() {
    const context = useContext(FormErrorsContext);
    if (!context)
        throw new Error("useFormErrors must be used within FormErrorsProvider");
    return context;
}
