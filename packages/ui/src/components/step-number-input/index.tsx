import { forwardRef, useId, useRef } from "react";
import type { ReactElement } from "react";
import type { BaseInputProps } from "../commons/input";
import { BaseInputWrapper } from "../commons/input";
import classNames from "classnames";
import { Button } from "../button";
import {
    NumberFormatBase,
    useNumericFormat,
    type InputAttributes,
    type NumberFormatValues,
} from "react-number-format";
import { Minus } from "../../assets/minus";
import { Plus } from "../../assets/plus";
import { ErrorText } from "../error-text";

import styles from "./styles.module.css";
import commonStyles from "../commons/styles.module.css";

// type InputBase = NumericFormatProps<InputAttributes> & BaseInputProps<string>;

// type InputBaseWithoutOverrides = Omit<
//     InputBase,
//     "id" | "size" | "value" | "icon" | "iconPlacement" | "onChange"
// >;

// FIXME: add the union types back

export type StepNumberInputProps = {
    id?: string;
    step?: InputAttributes["step"];
    label?: string;
    prefix?: string;
    error?: boolean;
    loading?: boolean;
    disabled?: boolean;
    allowNegative?: boolean;
    errorText?: string;
    className?: string;
    size?: BaseInputProps<string>["size"];
    value?: number;
    onBlur: BaseInputProps<string>["onBlur"];
    onChange: (event: number | undefined) => void;
    onIncrement: () => void;
    onDecrement: () => void;
};

export const StepNumberInput: React.ForwardRefExoticComponent<StepNumberInputProps> =
    forwardRef(function StepNumberInput(
        {
            id,
            label,
            size = "base",
            errorText,
            error = false,
            value,
            loading,
            disabled,
            allowNegative,
            onChange,
            onIncrement,
            onDecrement,
            onBlur,
            className,
            ...rest
        },
        ref,
    ): ReactElement {
        const generatedId = useId();
        const internalRef = useRef<HTMLInputElement>(null);
        const { format, ...formatBaseProps } = useNumericFormat({
            type: "text",
            thousandSeparator: " ",
            decimalSeparator: ".",
            value: value === undefined ? "" : value,
            allowNegative,
            ...rest,
        });

        function handleOnKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
            if (event.key === "ArrowDown") onDecrement();
            if (event.key === "ArrowUp") onIncrement();
        }

        function handleOnValueChange(values: NumberFormatValues) {
            onChange(values.floatValue);
        }

        const resolvedId = id || generatedId;

        return (
            <div className={classNames("root", className)}>
                <div
                    className={classNames(styles.wrapper, {
                        [styles[size]]: true,
                        [styles.error]: error,
                    })}
                >
                    <Button
                        size="xs"
                        icon={Minus}
                        disabled={disabled || loading}
                        onClick={onDecrement}
                        className={{
                            root: classNames(
                                styles.stepButton,
                                styles.stepDownButton,
                                {
                                    [styles[size]]: true,
                                    [styles.disabled]: disabled || loading,
                                },
                            ),
                            icon: styles.stepButtonIcon,
                        }}
                    />
                    <BaseInputWrapper
                        id={resolvedId}
                        label={label}
                        size={size}
                        error={error}
                        loading={loading}
                    >
                        <NumberFormatBase
                            id={resolvedId}
                            format={format}
                            getInputRef={ref}
                            {...formatBaseProps}
                            autoComplete="off"
                            placeholder=" "
                            onValueChange={handleOnValueChange}
                            onKeyDown={handleOnKeyDown}
                            onBlur={onBlur}
                            className={classNames("input", commonStyles.input, {
                                [commonStyles[size]]: true,
                            })}
                        />
                    </BaseInputWrapper>
                    <input
                        ref={internalRef}
                        type="number"
                        value={value}
                        disabled={disabled || loading}
                        className={styles.hiddenInput}
                    />
                    <Button
                        size="xs"
                        icon={Plus}
                        disabled={disabled || loading}
                        onClick={onIncrement}
                        className={{
                            root: classNames(
                                styles.stepButton,
                                styles.stepUpButton,
                                {
                                    [styles[size]]: true,
                                    [styles.disabled]: disabled || loading,
                                },
                            ),
                            icon: styles.stepButtonIcon,
                        }}
                    />
                </div>
                {error && errorText && (
                    <ErrorText
                        size="xs"
                        weight="medium"
                        className={styles.errorText}
                    >
                        {errorText}
                    </ErrorText>
                )}
            </div>
        );
    });
