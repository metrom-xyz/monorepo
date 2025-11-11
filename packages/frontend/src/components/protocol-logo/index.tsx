import { type ProtocolBase } from "@metrom-xyz/chains";
import { useTheme } from "next-themes";
import { Theme, type RemoteLogoSize } from "@metrom-xyz/ui";

import styles from "./styles.module.css";
import classNames from "classnames";

export interface ProtocolLogoProps {
    protocol?: ProtocolBase;
    size?: RemoteLogoSize;
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
                })}
            />
        );
    else if (Logo)
        return (
            <Logo
                className={classNames(styles.icon, className, {
                    [styles[size]]: true,
                })}
            />
        );

    return "-";
}
