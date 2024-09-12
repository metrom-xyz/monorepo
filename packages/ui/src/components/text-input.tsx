import React, { forwardRef, useId } from "react";
import type { ReactElement } from "react";
import type { BaseInputProps } from "./commons/input";
import { BaseInputWrapper } from "./commons/input";
import classNames from "classnames";

import styles from "./commons/styles.module.css";

export type TextInputProps = Omit<BaseInputProps<string>, "id"> & {
    id?: string;
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
    function TextInput(
        {
            id,
            label,
            variant = "base",
            errorText,
            icon,
            iconPlacement,
            action,
            actionPlacement,
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
                error={error}
                errorText={errorText}
                icon={icon}
                iconPlacement={iconPlacement}
                action={action}
                actionPlacement={actionPlacement}
                className={className}
            >
                <input
                    id={resolvedId}
                    type="text"
                    ref={ref}
                    value={value}
                    disabled={loading || disabled}
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
