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

export type TypographySize =
    | "xs"
    | "sm"
    | "base"
    | "lg"
    | "xl"
    | "xl2"
    | "xl3"
    | "xl4";

interface BaseTypographyProps {
    size?: TypographySize;
    weight?: "regular" | "medium" | "semibold" | "bold";
    variant?: "primary" | "secondary" | "tertiary";
    uppercase?: boolean;
    noWrap?: boolean;
    truncate?: boolean;
    mono?: boolean;
    className?: string;
    children: ReactNode;
}

type HTMLElementFromSize<V extends TypographySize> = V extends
    | "h4"
    | "h3"
    | "h2"
    | "h1"
    ? HTMLHeadingElement
    : HTMLParagraphElement;

export type TypographyProps<V extends TypographySize = TypographySize> = Omit<
    HTMLAttributes<HTMLElementFromSize<V>>,
    keyof BaseTypographyProps
> &
    BaseTypographyProps;

const COMPONENT_MAP: Record<TypographySize, ElementType> = {
    xs: "p",
    sm: "p",
    base: "p",
    lg: "p",
    xl: "p",
    xl2: "h1",
    xl3: "h1",
    xl4: "h1",
};

const Component = <V extends TypographySize>(
    {
        size = "base",
        weight = "regular",
        variant = "primary",
        uppercase,
        noWrap,
        truncate,
        mono,
        className,
        children,
        ...rest
    }: TypographyProps<V>,
    ref: ForwardedRef<HTMLElementFromSize<V>>,
): ReactElement => {
    const handleMouseEnter = useCallback(
        (event: React.MouseEvent<HTMLElementFromSize<V>, MouseEvent>) => {
            if (rest.onMouseEnter) rest.onMouseEnter(event);
        },
        [rest],
    );

    const handleMouseLeave = useCallback(
        (event: React.MouseEvent<HTMLElementFromSize<V>, MouseEvent>) => {
            if (rest.onMouseLeave) rest.onMouseLeave(event);
        },
        [rest],
    );

    const Root = COMPONENT_MAP[size];

    return (
        <Root
            className={classNames(className, styles.root, {
                [styles.rootUppercase]: uppercase,
                [styles[variant]]: true,
                [styles[size]]: true,
                [styles[weight]]: true,
                [styles.noWrap]: noWrap,
                [styles.truncate]: truncate,
                [styles.mono]: mono,
            })}
            {...rest}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            ref={(element: HTMLElementFromSize<V>) => {
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

export const Typography = forwardRef(Component) as <V extends TypographySize>(
    props: TypographyProps<V> & {
        ref?: React.ForwardedRef<HTMLElementFromSize<V>>;
    },
) => ReturnType<typeof Component>;
