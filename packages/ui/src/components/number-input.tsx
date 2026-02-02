import { forwardRef, useId } from "react";
import type { ReactElement } from "react";
import {
    type InputAttributes,
    type NumericFormatProps,
    NumericFormat,
} from "react-number-format";
import { type BaseInputProps, BaseInputWrapper } from "./commons/input";
import classNames from "classnames";

import styles from "./commons/styles.module.css";

export { type NumberFormatValues } from "react-number-format";

export type NumberInputProps = Omit<
    NumericFormatProps<InputAttributes> & Omit<BaseInputProps<string>, "value">,
    "size" | "id" | "placeholder" | "className"
> & {
    id?: string;
    size?: BaseInputProps<string>["size"];
    className?: BaseInputProps<string>["className"];
};

export const NumberInput: React.ForwardRefExoticComponent<
    NumberInputProps & React.RefAttributes<HTMLInputElement>
> = forwardRef(function NumberInput(
    {
        id,
        size = "base",
        value,
        label,
        errorText,
        prefixElement,
        icon,
        iconPlacement,
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
            filled={value === 0 || !!value}
            label={label}
            size={size}
            loading={loading}
            error={error}
            errorText={errorText}
            prefixElement={prefixElement}
            icon={icon}
            iconPlacement={iconPlacement}
            className={className}
        >
            <NumericFormat
                id={resolvedId}
                type="text"
                defaultValue=""
                thousandSeparator=" "
                decimalSeparator="."
                value={value}
                disabled={disabled || loading}
                getInputRef={ref}
                {...rest}
                autoComplete="off"
                placeholder=" "
                className={classNames("input", styles.input)}
            />
        </BaseInputWrapper>
    );
});
