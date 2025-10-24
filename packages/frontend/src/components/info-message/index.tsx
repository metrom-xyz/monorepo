import {
    Typography,
    type TypographyProps,
    type TypographySize,
} from "@metrom-xyz/ui";
import type { ReactNode } from "react";
import classNames from "classnames";

import styles from "./styles.module.css";

interface InfoMessageProps {
    text: ReactNode;
    link?: string;
    linkText?: string;
    size?: TypographySize;
    weight?: TypographyProps["weight"];
    spaced?: boolean;
    className?: string;
}

export function InfoMessage({
    text,
    link,
    linkText,
    size = "xs",
    weight = "medium",
    spaced,
    className,
}: InfoMessageProps) {
    return (
        <div className={className}>
            <Typography
                weight={weight}
                variant="tertiary"
                size={size}
                className={classNames({ [styles.text]: spaced })}
            >
                {text}
                {link && linkText && (
                    <>
                        {" "}
                        <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.link}
                        >
                            {linkText}
                        </a>
                        .
                    </>
                )}
            </Typography>
        </div>
    );
}
