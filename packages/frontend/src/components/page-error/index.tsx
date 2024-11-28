import { Button, Typography } from "@metrom-xyz/ui";
import Link from "next/link";
import { useTranslations } from "next-intl";

import styles from "./styles.module.css";

interface PageErrorProps {
    error: Error;
    reset: () => void;
}

// TODO: add illustration
export function PageError({ error, reset }: PageErrorProps) {
    const t = useTranslations("error");

    return (
        <div className={styles.root}>
            <Typography size="xl4" weight="medium">
                {t("title")}
            </Typography>
            <div className={styles.buttonsWrapper}>
                <Link href="/">
                    <Button size="sm">{t("home")}</Button>
                </Link>
                <Button size="sm" onClick={reset}>
                    {t("retry")}
                </Button>
            </div>
        </div>
    );
}
