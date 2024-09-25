import React from "react";
import type {
    ChangeEventHandler,
    FunctionComponent,
    InputHTMLAttributes,
    ReactElement,
    ReactNode,
} from "react";
import classNames from "classnames";
import { Typography } from "../typography";

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
    className?: string;
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
            className={classNames("inputIconWrapper", styles.inputIconWrapper, {
                [styles.placeLeft]: iconPlacement === "left",
                [styles.placeRight]: iconPlacement === "right",
            })}
        >
            <Icon className={classNames("inputIcon", styles.inputIcon)} />
        </div>
    );

    const action = Action && (
        <div
            className={classNames(
                "inputActionWrapper",
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
        <div className={className}>
            {!!label && (
                <label
                    className={classNames("label", styles.label)}
                    htmlFor={id}
                >
                    <Typography
                        uppercase
                        variant="xs"
                        weight="medium"
                        light
                        className="labelText"
                    >
                        {label}
                    </Typography>
                </label>
            )}
            <div className={classNames("inputWrapper", styles.inputWrapper)}>
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
