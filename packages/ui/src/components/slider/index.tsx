import { forwardRef, useId, type ReactElement } from "react";
import { BaseInputWrapper, type BaseInputProps } from "../commons/input";
import classNames from "classnames";
import { Typography } from "../typography";

import styles from "./styles.module.css";

export type SliderInputProps = Omit<
    BaseInputProps<number>,
    "id" | "icon" | "iconPlacement" | "action" | "actionPlacement"
> & {
    id?: string;
};

export const SliderInput = forwardRef<HTMLInputElement, SliderInputProps>(
    function SliderInput(
        {
            id,
            label,
            size,
            errorText,
            error = false,
            className,
            value = 0,
            min = 0,
            max = 100,
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
                size={size}
                loading={loading}
                label={label}
                error={error}
                errorText={errorText}
                className={className}
            >
                <div className={classNames("sliderWrapper", styles.wrapper)}>
                    <Typography
                        size={size}
                        weight="medium"
                        className={classNames("value", {
                            [styles.loading]: loading,
                        })}
                    >
                        {((value / Number(max)) * 100).toFixed(0)}%
                    </Typography>
                    <input
                        id={resolvedId}
                        ref={ref}
                        type="range"
                        value={value}
                        min={min}
                        max={max}
                        disabled={loading || disabled}
                        {...rest}
                        className={styles.slider}
                    />
                </div>
            </BaseInputWrapper>
        );
    },
);
