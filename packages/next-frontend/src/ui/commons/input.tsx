import React from "react";
import type {
    ChangeEventHandler,
    FunctionComponent,
    InputHTMLAttributes,
    ReactElement,
    ReactNode,
} from "react";
import classNames from "@/src/utils/classes";
import { Typography, type TypographyProps } from "../typography";

import styles from "./styles.module.css";

export interface PartialBaseInputProps<V> {
    error?: boolean;
    errorText?: string;
    variant?: "xs" | "sm" | "base" | "lg";
    placeholder?: string;
    loading?: boolean;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    value?: V;
    border?: boolean;
}

export type BaseInputProps<V> = PartialBaseInputProps<V> &
    BaseInputWrapperProps &
    Omit<
        InputHTMLAttributes<HTMLInputElement>,
        keyof PartialBaseInputProps<V> | keyof BaseInputWrapperProps | "ref"
    >;

export interface BaseInputWrapperProps {
    id: string;
    label?: string;
    variant?: "xs" | "sm" | "base" | "lg";
    error?: boolean;
    border?: boolean;
    errorText?: string;
    icon?: FunctionComponent<React.SVGProps<SVGSVGElement>>;
    iconPlacement?: "left" | "right";
    action?: ReactNode;
    actionPlacement?: "left" | "right";
    className?: {
        root?: string;
        label?: string;
        labelText?: TypographyProps["className"];
        infoIcon?: string;
        errorTextContainer?: string;
        errorTextIcon?: string;
        errorText?: TypographyProps["className"];
        // should be applied when using the wrapper
        inputIcon?: string;
        inputIconWrapper?: string;
        inputActionWrapper?: string;
        inputWrapper?: string;
        input?: string;
    };
    children?: ReactNode;
}

export const BaseInputWrapper = ({
    id,
    label,
    // TODO: implement error
    // error,
    // errorText,
    icon: Icon,
    iconPlacement = "right",
    action: Action,
    actionPlacement = "right",
    className,
    children,
}: BaseInputWrapperProps): ReactElement => {
    const icon = !Action && Icon && (
        <div
            className={classNames(
                className?.inputIconWrapper,
                styles.inputIconWrapper,
                {
                    [styles.placeLeft]: iconPlacement === "left",
                    [styles.placeRight]: iconPlacement === "right",
                },
            )}
        >
            <Icon
                className={classNames(styles.inputIcon, className?.inputIcon)}
            />
        </div>
    );

    const action = Action && (
        <div
            className={classNames(
                className?.inputActionWrapper,
                styles.inputActionWrapper,
                {
                    [styles.placeLeft]: actionPlacement === "left",
                    [styles.placeRight]: actionPlacement === "right",
                },
            )}
        >
            {Action}
        </div>
    );

    return (
        <div className={className?.root}>
            {!!label && (
                <label
                    className={classNames(className?.label, styles.label)}
                    htmlFor={id}
                >
                    <Typography
                        variant="xs"
                        weight="medium"
                        className={className?.labelText}
                    >
                        {label}
                    </Typography>
                </label>
            )}
            <div
                className={classNames(
                    className?.inputWrapper,
                    styles.inputWrapper,
                )}
            >
                {iconPlacement === "left" && icon}
                {actionPlacement === "left" && action}
                {children}
                {iconPlacement === "right" && icon}
                {actionPlacement === "right" && action}
            </div>
            {/* {error && errorText && <ErrorText>{errorText}</ErrorText>} */}
        </div>
    );
};
