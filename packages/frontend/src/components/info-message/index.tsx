import { Typography } from "@metrom-xyz/ui";
import type { ReactNode } from "react";

import styles from "./styles.module.css";

interface InfoMessageProps {
    text: ReactNode;
    link?: string;
    linkText?: string;
    className?: string;
}

export function InfoMessage({
    text,
    link,
    linkText,
    className,
}: InfoMessageProps) {
    return (
        <div className={className}>
            <Typography weight="medium" light size="xs">
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
