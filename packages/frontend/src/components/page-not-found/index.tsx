import { Button, Typography } from "@metrom-xyz/ui";
import Link from "next/link";
import { useTranslations } from "next-intl";

import styles from "./styles.module.css";

interface PageNotFoundProps {
    message: string;
}

// TODO: add illustration
export function PageNotFound({ message }: PageNotFoundProps) {
    const t = useTranslations("notFound");

    return (
        <div className={styles.root}>
            <Typography variant="xl5" weight="bold">
                404
            </Typography>
            <Typography variant="xl4" weight="medium">
                {message}
            </Typography>
            <Link href="/">
                <Button size="small">{t("button")}</Button>
            </Link>
        </div>
    );
}
