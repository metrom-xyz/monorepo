import { ErrorIcon } from "@/src/assets/error-icon";
import { Typography, type TypographyProps } from "../typography";

import styles from "./styles.module.css";

interface ErrorTextProps extends TypographyProps {}

export function ErrorText({ children, className, ...rest }: ErrorTextProps) {
    return (
        <div className={`root ${styles.root} ${className}`}>
            <ErrorIcon className={`icon ${styles.icon}`} />
            <Typography uppercase {...rest} className={styles.text}>
                {children}
            </Typography>
        </div>
    );
}
