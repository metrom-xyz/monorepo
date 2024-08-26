import React, { forwardRef, useId } from "react";
import type { ReactElement } from "react";
import { NumericFormat, type NumericFormatProps } from "react-number-format";
import { type BaseInputProps, BaseInputWrapper } from "./commons/input";

export { type NumberFormatValues } from "react-number-format";

import styles from "./commons/styles.module.css";
import classNames from "../utils/classes";

export type NumberInputProps = Omit<
    NumericFormatProps & BaseInputProps<string>,
    "size" | "id" | "className"
> & { id?: string; className?: BaseInputProps<string>["className"] };

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
    function NumberInput(
        {
            id,
            variant = "base",
            value,
            label,
            placeholder,
            border,
            errorText,
            icon,
            iconPlacement,
            action,
            actionPlacement,
            error = false,
            className,
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
                error={error}
                errorText={errorText}
                icon={icon}
                iconPlacement={iconPlacement}
                action={action}
                actionPlacement={actionPlacement}
                className={className}
            >
                <NumericFormat
                    type="text"
                    defaultValue=""
                    thousandSeparator=","
                    decimalSeparator="."
                    value={value}
                    disabled={disabled || loading}
                    placeholder={placeholder}
                    getInputRef={ref}
                    id={resolvedId}
                    {...rest}
                    className={classNames("input", styles.input, {
                        [styles.inputError]: error,
                        [styles[
                            `input${variant[0].toUpperCase()}${variant.slice(1)}`
                        ]]: true,
                        [styles.inputLoading]: loading,
                        [styles.hasLeftIcon]:
                            !!icon && iconPlacement === "left",
                    })}
                />
            </BaseInputWrapper>
        );
    },
);
