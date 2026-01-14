import React, { useMemo, useState } from "react";
import type {
    ChangeEventHandler,
    FunctionComponent,
    InputHTMLAttributes,
    ReactElement,
    ReactNode,
} from "react";
import classNames from "classnames";
import { Typography } from "../typography";
import { ErrorText } from "../error-text";

import styles from "./styles.module.css";

export type BaseInputSize = "xs" | "sm" | "base" | "lg";

export interface PartialBaseInputProps<V> {
    error?: boolean;
    errorText?: string;
    size?: BaseInputSize;
    placeholder?: string;
    loading?: boolean;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    value?: V;
    border?: boolean;
}

export type BaseInputProps<V> = PartialBaseInputProps<V> &
    Omit<BaseInputWrapperProps<V>, "children"> &
    Omit<
        InputHTMLAttributes<HTMLInputElement>,
        keyof PartialBaseInputProps<V> | keyof BaseInputWrapperProps<V> | "ref"
    >;

export interface BaseInputWrapperProps<V> {
    id: string;
    filled?: boolean;
    label?: string;
    size?: BaseInputSize;
    loading?: boolean;
    error?: boolean;
    hideLabel?: boolean;
    errorText?: string;
    prefixElement?: ReactNode;
    icon?: FunctionComponent<React.SVGProps<SVGSVGElement>>;
    iconPlacement?: "left" | "right";
    className?: string;
    children: ReactElement<BaseInputProps<V>>;
}

export function BaseInputWrapper<V>({
    id,
    filled,
    label,
    size = "base",
    loading,
    error,
    hideLabel = false,
    errorText,
    prefixElement,
    icon: Icon,
    iconPlacement = "right",
    className,
    children,
}: BaseInputWrapperProps<V>): ReactElement {
    const [prefixRef, setPrefixRef] = useState<HTMLDivElement | null>(null);

    const icon = Icon && (
        <div
            className={classNames("inputIconWrapper", styles.inputIconWrapper, {
                [styles.hasPrefixElement]: !!prefixElement,
                [styles.placeLeft]: iconPlacement === "left",
                [styles.placeRight]: iconPlacement === "right",
            })}
        >
            <Icon
                className={classNames("inputIcon", styles.inputIcon, {
                    [styles.filled]: filled,
                    [styles[size]]: true,
                })}
            />
        </div>
    );

    const inputLeftPadding = useMemo(() => {
        let padding = 0;
        if (prefixRef) padding += prefixRef.offsetWidth + 12;
        if (!!icon && iconPlacement === "left") padding += 36;

        return padding;
    }, [prefixRef, icon, iconPlacement]);

    return (
        <div
            className={classNames("root", className, {
                [styles[size]]: true,
                [styles.hasPrefixElement]: !!prefixElement,
                [styles.hasLeftIcon]: !!icon && iconPlacement === "left",
                [styles.hasRightIcon]: !!icon && iconPlacement === "right",
            })}
        >
            {!!label && (
                <label
                    className={classNames("label", styles.label, {
                        [styles.hide]: hideLabel,
                    })}
                    htmlFor={id}
                >
                    <Typography
                        uppercase
                        size="xs"
                        weight="medium"
                        variant="tertiary"
                        className="labelText"
                    >
                        {label}
                    </Typography>
                </label>
            )}
            <div className={classNames("inputWrapper", styles.inputWrapper)}>
                {prefixElement && (
                    <div
                        ref={setPrefixRef}
                        className={classNames(styles.prefixElementWrapper, {
                            [styles.hasLeftIcon]:
                                !!icon && iconPlacement === "left",
                        })}
                    >
                        {prefixElement}
                    </div>
                )}
                {iconPlacement === "left" && icon}
                {React.cloneElement(children, {
                    className: classNames(children.props.className, {
                        [styles.inputError]: !!error,
                        [styles.inputLoading]: !!loading,
                        [styles[size]]: true,
                    }),
                    style: {
                        ...(inputLeftPadding
                            ? { paddingLeft: `${inputLeftPadding}px` }
                            : {}),
                    },
                })}
                {iconPlacement === "right" && icon}
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
}
