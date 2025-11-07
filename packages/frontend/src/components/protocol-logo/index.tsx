import { type ProtocolBase } from "@metrom-xyz/chains";
import { useTheme } from "next-themes";
import { SupportedLiquityV2 } from "@metrom-xyz/sdk";
import { Theme } from "@metrom-xyz/ui";

import styles from "./styles.module.css";
import classNames from "classnames";

const SCALE_PROTOCOLS_LOGO: string[] = [SupportedLiquityV2.Orki];

export interface ProtocolLogoProps {
    protocol?: ProtocolBase;
    size?: "base" | "sm" | "md" | "lg";
    className?: string;
}

export function ProtocolLogo({
    protocol,
    size = "base",
    className,
}: ProtocolLogoProps) {
    const { resolvedTheme } = useTheme();

    const Logo = protocol?.logo;
    const LogoLight = protocol?.logoLight;

    if (LogoLight && resolvedTheme === Theme.Dark)
        return (
            <LogoLight
                className={classNames(styles.icon, className, {
                    [styles[size]]: true,
                    [styles.iconBig]: SCALE_PROTOCOLS_LOGO.includes(
                        protocol.slug,
                    ),
                })}
            />
        );
    else if (Logo)
        return (
            <Logo
                className={classNames(styles.icon, className, {
                    [styles[size]]: true,
                    [styles.iconBig]: SCALE_PROTOCOLS_LOGO.includes(
                        protocol.slug,
                    ),
                })}
            />
        );

    return "-";
}
