import classNames from "classnames";
import {
    forwardRef,
    type AnchorHTMLAttributes,
    type ButtonHTMLAttributes,
    type ElementType,
    type ForwardedRef,
    type FunctionComponent,
    type ReactNode,
    type SVGProps,
} from "react";
import { SpinnerDarkIcon } from "../../assets/spinner-dark";
import { SpinnerLightIcon } from "../../assets/spinner-light";

import styles from "./styles.module.css";

export interface BaseButtonProps {
    onClick?: (event: React.MouseEvent) => void;
    disabled?: boolean;
    loading?: boolean;
    className?: {
        root?: string;
        icon?: string;
        contentWrapper?: string;
    };
    icon?: FunctionComponent<SVGProps<SVGSVGElement>>;
    iconPlacement?: "left" | "right";
    size?: "lg" | "sm" | "base" | "xs";
    variant?: "primary" | "secondary";
    border?: boolean;
    children?: ReactNode;
}

export type CleanHTMLButtonProps = BaseButtonProps &
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps>;
export type CleanHTMLAnchorProps = BaseButtonProps &
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps>;

export type ButtonProps = CleanHTMLButtonProps | CleanHTMLAnchorProps;

export type RefType<P extends ButtonProps> = ForwardedRef<
    "href" extends keyof P ? HTMLAnchorElement : HTMLButtonElement
>;

const Component = (props: ButtonProps, ref: RefType<typeof props>) => {
    const {
        variant = "primary",
        size = "base",
        disabled,
        onClick,
        loading,
        children,
        className,
        border = true,
        icon: Icon,
        iconPlacement = "left",
        ...rest
    } = props;

    const sharedProps = {
        className: classNames(className?.root, styles.root, {
            [styles[size]]: true,
            [styles[variant]]: true,
            [styles.noBorder]: !border,
            [styles.disabled]: disabled || loading,
        }),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [Root, rootProps]: [ElementType, any] =
        "href" in rest
            ? ["a", { href: rest.href, onClick }]
            : ["button", { onClick, disabled: disabled || loading }];

    const hasIcon = !!Icon;
    let resolvedIcon;
    if (loading)
        resolvedIcon = (
            <>
                <SpinnerDarkIcon
                    className={classNames(
                        className?.icon,
                        styles.spinner,
                        styles.icon,
                        styles.dark,
                        {
                            [styles[size]]: true,
                        },
                    )}
                />
                <SpinnerLightIcon
                    className={classNames(
                        className?.icon,
                        styles.spinner,
                        styles.icon,
                        styles.light,
                        {
                            [styles[size]]: true,
                        },
                    )}
                />
            </>
        );
    else if (hasIcon)
        resolvedIcon = (
            <Icon
                className={classNames(className?.icon, styles.icon, {
                    [styles[size]]: true,
                })}
            />
        );

    return (
        <Root {...sharedProps} {...rootProps} {...rest} ref={ref}>
            {children && iconPlacement === "left" && resolvedIcon}
            {children ? (
                <div
                    className={classNames(
                        className?.contentWrapper,
                        styles.wrapper,
                        { [styles[size]]: true },
                    )}
                >
                    {children}
                </div>
            ) : (
                resolvedIcon
            )}
            {children && iconPlacement === "right" && resolvedIcon}
        </Root>
    );
};

export const Button = forwardRef(Component) as <P extends ButtonProps>(
    props: P & {
        ref?: RefType<P>;
    },
) => ReturnType<typeof Component>;
