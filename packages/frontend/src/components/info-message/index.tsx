import {
    Typography,
    type TypographyProps,
    type TypographySize,
} from "@metrom-xyz/ui";
import type { ReactNode } from "react";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";

import styles from "./styles.module.css";

interface InfoMessageProps {
    text: ReactNode;
    link?: string;
    linkText?: string;
    size?: TypographySize;
    weight?: TypographyProps["weight"];
    variant?: TypographyProps["variant"];
    spaced?: boolean;
}

export function InfoMessage({
    text,
    link,
    linkText,
    size = "xs",
    weight = "medium",
    variant = "tertiary",
    spaced,
}: InfoMessageProps) {
    const t = useTranslations();

    return (
        <Typography
            weight={weight}
            variant={variant}
            size={size}
            className={classNames({ [styles.spaced]: spaced })}
        >
            {text}
            {link && (
                <>
                    {" "}
                    <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                    >
                        {linkText || t("readMore")}
                        <ArrowRightIcon className={styles.arrowIcon} />
                    </a>
                </>
            )}
        </Typography>
    );
}
