import React, {
    forwardRef,
    type ElementType,
    type HTMLAttributes,
    type ReactNode,
    type ForwardedRef,
    type ReactElement,
    useCallback,
} from "react";
import classNames from "classnames";

import styles from "./styles.module.css";

export type TypographyVariant =
    | "xs"
    | "sm"
    | "base"
    | "lg"
    | "xl"
    | "xl2"
    | "xl4"
    | "xl5";

interface BaseTypographyProps {
    variant?: TypographyVariant;
    weight?: "normal" | "medium" | "bold";
    light?: boolean;
    uppercase?: boolean;
    noWrap?: boolean;
    mono?: boolean;
    className?: string;
    children: ReactNode;
}

type HTMLElementFromVariant<V extends TypographyVariant> = V extends
    | "h4"
    | "h3"
    | "h2"
    | "h1"
    ? HTMLHeadingElement
    : HTMLParagraphElement;

export type TypographyProps<V extends TypographyVariant = TypographyVariant> =
    Omit<HTMLAttributes<HTMLElementFromVariant<V>>, keyof BaseTypographyProps> &
        BaseTypographyProps;

const COMPONENT_MAP: Record<TypographyVariant, ElementType> = {
    xs: "p",
    sm: "p",
    base: "p",
    lg: "p",
    xl: "p",
    xl2: "h1",
    xl4: "h1",
    xl5: "h1",
};

const Component = <V extends TypographyVariant>(
    {
        variant = "base",
        weight = "normal",
        light,
        uppercase,
        noWrap,
        mono,
        className,
        children,
        ...rest
    }: TypographyProps<V>,
    ref: ForwardedRef<HTMLElementFromVariant<V>>,
): ReactElement => {
    const handleMouseEnter = useCallback(
        (event: React.MouseEvent<HTMLElementFromVariant<V>, MouseEvent>) => {
            if (rest.onMouseEnter) rest.onMouseEnter(event);
        },
        [rest],
    );

    const handleMouseLeave = useCallback(
        (event: React.MouseEvent<HTMLElementFromVariant<V>, MouseEvent>) => {
            if (rest.onMouseLeave) rest.onMouseLeave(event);
        },
        [rest],
    );

    const Root = COMPONENT_MAP[variant];

    return (
        <Root
            className={classNames(className, styles.root, {
                [styles.rootUppercase]: uppercase,
                [styles.light]: light,
                [styles[variant]]: true,
                [styles[weight]]: true,
                [styles.noWrap]: noWrap,
                [styles.mono]: mono,
            })}
            {...rest}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            ref={(element: HTMLElementFromVariant<V>) => {
                if (ref) {
                    if (typeof ref === "function") ref(element);
                    else ref.current = element;
                }
            }}
        >
            {children}
        </Root>
    );
};

export const Typography = forwardRef(Component) as <
    V extends TypographyVariant,
>(
    props: TypographyProps<V> & {
        ref?: React.ForwardedRef<HTMLElementFromVariant<V>>;
    },
) => ReturnType<typeof Component>;
