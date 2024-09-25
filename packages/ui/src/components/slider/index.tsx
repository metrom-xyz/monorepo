import { forwardRef, useId, type ReactElement } from "react";
import { BaseInputWrapper, type BaseInputProps } from "../commons/input";
import classNames from "classnames";

import styles from "./styles.module.css";
import { Typography } from "../typography";

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
                label={label}
                error={error}
                errorText={errorText}
                className={className}
            >
                <div className={classNames("slider-wrapper", styles.wrapper)}>
                    <Typography weight="medium">
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
                        className={classNames("input", styles.slider)}
                    />
                </div>
            </BaseInputWrapper>
        );
    },
);
