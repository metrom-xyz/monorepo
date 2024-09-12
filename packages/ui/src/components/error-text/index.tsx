import { ErrorIcon } from "../..//assets/error";
import { Typography, type TypographyProps } from "../typography";

import styles from "./styles.module.css";

type ErrorTextProps = TypographyProps;

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
