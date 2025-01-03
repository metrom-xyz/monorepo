import { forwardRef, useId } from "react";
import type { ReactElement } from "react";
import type { BaseInputProps } from "./commons/input";
import { BaseInputWrapper } from "./commons/input";

export type TextInputProps = Omit<BaseInputProps<string>, "id"> & {
    id?: string;
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
    function TextInput(
        {
            id,
            label,
            size = "base",
            errorText,
            icon,
            iconPlacement,
            error = false,
            className,
            value,
            loading,
            disabled,
            ...rest
        },
        ref,
    ): ReactElement {
        const generatedId = useId();

        const resolvedId = id || generatedId;

        return (
            <BaseInputWrapper
                id={resolvedId}
                label={label}
                size={size}
                loading={loading}
                error={error}
                errorText={errorText}
                icon={icon}
                iconPlacement={iconPlacement}
                className={className}
            >
                <input
                    id={resolvedId}
                    type="text"
                    ref={ref}
                    value={value}
                    disabled={loading || disabled}
                    {...rest}
                />
            </BaseInputWrapper>
        );
    },
);
