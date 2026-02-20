import React, { useLayoutEffect, useState } from "react";
import type {
    ChangeEventHandler,
    FunctionComponent,
    InputHTMLAttributes,
    ReactElement,
    ReactNode,
} from "react";
import classNames from "classnames";
import { ErrorText } from "../error-text";

import styles from "./styles.module.css";

export type BaseInputSize = "xs" | "sm" | "base" | "lg";

export interface PartialBaseInputProps<V> {
    error?: boolean;
    errorText?: string;
    size?: BaseInputSize;
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
    focused?: boolean;
    filled?: boolean;
    label?: string;
    size?: BaseInputSize;
    loading?: boolean;
    disabled?: boolean;
    error?: boolean;
    errorText?: string;
    prefixElement?: ReactNode;
    noPrefixPadding?: boolean;
    endAdornment?: ReactNode;
    icon?: FunctionComponent<React.SVGProps<SVGSVGElement>>;
    iconPlacement?: "left" | "right";
    className?: string;
    children: ReactElement<BaseInputProps<V>>;
}

export function BaseInputWrapper<V>({
    id,
    focused,
    filled,
    label,
    size = "base",
    loading,
    disabled,
    error,
    errorText,
    prefixElement,
    noPrefixPadding,
    endAdornment,
    icon: Icon,
    iconPlacement = "right",
    className,
    children,
}: BaseInputWrapperProps<V>): ReactElement {
    const [prefixRef, setPrefixRef] = useState<HTMLDivElement | null>(null);
    const [inputLeftPadding, setInputLeftPadding] = useState(0);
    const [mounted, setMounted] = useState(false);

    const icon = Icon && (
        <div
            className={classNames("inputIconWrapper", styles.inputIconWrapper, {
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

    useLayoutEffect(() => {
        if (!prefixRef && !icon) return;

        let padding = 0;
        if (prefixRef) padding += prefixRef.offsetWidth + 12;
        if (!!icon && iconPlacement === "left") padding += 36;

        setInputLeftPadding(padding);
    }, [prefixRef, icon, iconPlacement]);

    useLayoutEffect(() => {
        requestAnimationFrame(() => {
            setMounted(true);
        });
    }, []);

    const hasLeftIcon = !!icon && iconPlacement === "left";
    const hasRightIcon = !!icon && iconPlacement === "right";

    return (
        <div className={classNames("root", styles.inputRoot, className)}>
            <div
                className={classNames("inputWrapper", styles.inputWrapper, {
                    [styles.error]: !!error,
                    [styles.focused]: !!focused,
                    [styles.disabled]: !!disabled,
                    [styles.loading]: !!loading,
                    [styles.mounted]: mounted,
                    [styles.hasRightIcon]: hasRightIcon,
                })}
            >
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
                        [styles.focused]: !!focused,
                        [styles[size]]: true,
                    }),
                    style: {
                        ...(inputLeftPadding
                            ? { paddingLeft: `${inputLeftPadding}px` }
                            : {}),
                    },
                })}
                {!!label && (
                    <label
                        htmlFor={id}
                        className={classNames(
                            "label",
                            styles.label,
                            styles.floating,
                            {
                                [styles[size]]: true,
                                [styles.hasLeftIcon]: hasLeftIcon,
                                [styles.hasPrefixElement]: !!prefixElement,
                                [styles.noPrefixPadding]: noPrefixPadding,
                            },
                        )}
                        style={
                            {
                                ...(!!prefixElement && inputLeftPadding
                                    ? {
                                          "--label-prefix-pl": `${inputLeftPadding}px`,
                                      }
                                    : {}),
                            } as React.CSSProperties
                        }
                    >
                        {label}
                    </label>
                )}
                {iconPlacement === "right" && icon}
                {endAdornment && (
                    <div
                        className={classNames(styles.adornment, {
                            [styles[size]]: true,
                        })}
                    >
                        {endAdornment}
                    </div>
                )}
                <fieldset aria-hidden="true" className={styles.fieldset}>
                    <legend>
                        <span className={classNames({ [styles[size]]: true })}>
                            {label}
                        </span>
                    </legend>
                </fieldset>
            </div>
            {error && errorText && (
                <ErrorText
                    size="xs"
                    uppercase={false}
                    className={styles.errorText}
                >
                    {errorText}
                </ErrorText>
            )}
        </div>
    );
}
