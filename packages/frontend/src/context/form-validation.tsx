import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react";

export interface FormSteps<T> {
    basics?: T;
    rewards?: T;
    restrictions?: T;
    kpi?: T;
    range?: T;
    approveLaunch?: T;
}

interface FormValidationContextValue {
    errors: FormSteps<string>;
    unsaved: FormSteps<boolean>;
    updateErrors: (errors: Partial<FormSteps<string>>) => void;
    updateUnsaved: (unsaved: Partial<FormSteps<boolean>>) => void;
}

const FormValidationContext = createContext<FormValidationContextValue | null>(
    null,
);

export function FormValidationProvider({ children }: { children: ReactNode }) {
    const [errors, setErrors] = useState<FormSteps<string>>({});
    const [unsaved, setUnsaved] = useState<FormSteps<boolean>>({});

    const updateErrors = useCallback(
        (newErrors: Partial<FormSteps<string>>) => {
            setErrors((prev) => ({ ...prev, ...newErrors }));
        },
        [],
    );

    const updateUnsaved = useCallback(
        (newUnsaved: Partial<FormSteps<boolean>>) => {
            setUnsaved((prev) => ({ ...prev, ...newUnsaved }));
        },
        [],
    );

    const value = useMemo(
        () => ({ errors, unsaved, updateErrors, updateUnsaved }),
        [errors, unsaved, updateErrors, updateUnsaved],
    );

    return (
        <FormValidationContext.Provider value={value}>
            {children}
        </FormValidationContext.Provider>
    );
}

export function useFormValidation() {
    const context = useContext(FormValidationContext);
    if (!context)
        throw new Error(
            "useFormValidation must be used within FormValidationProvider",
        );
    return context;
}
