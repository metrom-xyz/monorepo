import type { ReactNode } from "react";
import {
    Typography,
    type TypographyProps,
    type TypographySize,
} from "@metrom-xyz/ui";
import classNames from "classnames";

import styles from "./styles.module.css";

interface CampaignTagProps {
    text: ReactNode;
    size?: TypographySize;
    variant?: "primary" | "secondary";
    typographyVariant?: TypographyProps["variant"];
    className?: string;
}

export function CampaignTag({
    text,
    size = "xs",
    variant = "primary",
    typographyVariant = "primary",
    className,
}: CampaignTagProps) {
    return (
        <div
            className={classNames("root", styles.root, className, {
                [styles[variant]]: true,
            })}
        >
            {typeof text === "string" ? (
                <Typography
                    size={size}
                    weight="medium"
                    uppercase
                    variant={typographyVariant}
                >
                    {text}
                </Typography>
            ) : (
                text
            )}
        </div>
    );
}
