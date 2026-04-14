import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react";

interface FormStepsContextValue {
    cursor: number;
    setCursor: (step: number) => void;
}

const FormStepsContext = createContext<FormStepsContextValue | null>(null);

export function FormStepsProvider({ children }: { children: ReactNode }) {
    const [cursor, setCursor] = useState<number>(0);

    const updateCursor = useCallback((value: number) => {
        setCursor(value);
    }, []);

    const value = useMemo(
        () => ({ cursor, setCursor: updateCursor }),
        [cursor, updateCursor],
    );

    return (
        <FormStepsContext.Provider value={value}>
            {children}
        </FormStepsContext.Provider>
    );
}

export function useFormSteps() {
    const context = useContext(FormStepsContext);
    if (!context)
        throw new Error("useFormSteps must be used within FormStepsContext");
    return context;
}
