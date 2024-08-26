import { ErrorIcon } from "@/src/assets/error-icon";
import { Typography, type TypographyProps } from "../typography";

import styles from "./styles.module.css";

interface ErrorTextProps extends TypographyProps {}

export function ErrorText({ children, ...rest }: ErrorTextProps) {
    return (
        <div className={styles.root}>
            <ErrorIcon className={styles.icon} />
            <Typography uppercase {...rest} className={styles.text}>
                {children}
            </Typography>
        </div>
    );
}
