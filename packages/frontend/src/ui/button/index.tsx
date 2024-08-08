import classNames from "@/src/utils/classes";
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
import { SpinnerIcon } from "@/src/assets/spinner-icon";

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
    size?: "big" | "small" | "xsmall";
    variant?: "primary" | "secondary";
    active?: boolean;
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
        size = "big",
        disabled,
        onClick,
        loading,
        children,
        className,
        active = false,
        icon: Icon,
        iconPlacement = "left",
        ...rest
    } = props;

    const sharedProps = {
        className: classNames(className?.root, styles.root, {
            [styles[size]]: true,
            [styles[variant]]: true,
        }),
    };
    const [Root, rootProps]: [ElementType, any] =
        "href" in rest
            ? ["a", { href: rest.href }]
            : ["button", { onClick, disabled: disabled || loading }];

    const hasIcon = !!Icon;
    let resolvedIcon;
    if (!!loading)
        resolvedIcon = (
            <SpinnerIcon
                className={classNames(
                    className?.icon,
                    styles.spinner,
                    styles.icon,
                )}
            />
        );
    else if (!!hasIcon)
        resolvedIcon = (
            <Icon className={classNames(className?.icon, styles.icon)} />
        );

    return (
        <Root {...sharedProps} {...rootProps} {...rest} ref={ref}>
            {children && iconPlacement === "left" && resolvedIcon}
            {children ? (
                <div
                    className={classNames(
                        className?.contentWrapper,
                        styles.wrapper,
                        {
                            [styles.wrapperLoadingNoIcon]: loading && !hasIcon,
                        },
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
