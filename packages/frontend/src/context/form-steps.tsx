import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import { FormStepId } from "../types/form";

export interface FormSteps<T> {
    basics?: T;
    rewards?: T;
    restrictions?: T;
    kpi?: T;
    range?: T;
    approveLaunch?: T;
}

interface FormStepsContextValue {
    errors: FormSteps<string>;
    unsaved: FormSteps<boolean>;
    activeStepId: FormStepId;
    updateErrors: (errors: Partial<FormSteps<string>>) => void;
    updateUnsaved: (unsaved: Partial<FormSteps<boolean>>) => void;
    updateActiveStepId: (stepId: FormStepId) => void;
}

const FormStepsContext = createContext<FormStepsContextValue | null>(null);

export function FormStepsProvider({ children }: { children: ReactNode }) {
    const [errors, setErrors] = useState<FormSteps<string>>({});
    const [unsaved, setUnsaved] = useState<FormSteps<boolean>>({});
    const [activeStepId, setActiveStepId] = useState<FormStepId>(
        FormStepId.Basics,
    );

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

    const updateActiveStepId = useCallback((stepId: FormStepId) => {
        setActiveStepId(stepId);
    }, []);

    const value = useMemo(
        () => ({
            errors,
            unsaved,
            activeStepId,
            updateErrors,
            updateUnsaved,
            updateActiveStepId,
        }),
        [
            errors,
            unsaved,
            activeStepId,
            updateErrors,
            updateUnsaved,
            updateActiveStepId,
        ],
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
        throw new Error("useFormSteps must be used within FormStepsProvider");
    return context;
}
