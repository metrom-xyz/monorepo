import { forwardRef, useId } from "react";
import type { ReactElement } from "react";
import type { BaseInputProps } from "./commons/input";
import { BaseInputWrapper } from "./commons/input";
import classNames from "classnames";

import styles from "./commons/styles.module.css";

export type TextInputProps = Omit<
    BaseInputProps<string>,
    "id" | "filled" | "placeholder"
> & {
    id?: string;
    focused?: boolean;
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
    function TextInput(
        {
            id,
            focused,
            label,
            size = "base",
            errorText,
            prefixElement,
            noPrefixPadding,
            endAdornment,
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
                focused={focused}
                filled={!!value}
                label={label}
                size={size}
                loading={loading}
                disabled={disabled}
                error={error}
                errorText={errorText}
                prefixElement={prefixElement}
                noPrefixPadding={noPrefixPadding}
                endAdornment={endAdornment}
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
                    autoComplete="off"
                    placeholder=" "
                    className={classNames("input", styles.input)}
                />
            </BaseInputWrapper>
        );
    },
);
