import { Typography } from "@/src/ui/typography";
import { Link } from "@/src/i18n/routing";
import { Button } from "@/src/ui/button";
import { useTranslations } from "next-intl";

import styles from "./styles.module.css";

export function AllClaimed() {
    const t = useTranslations("claims.allClaimed");

    return (
        <div className={styles.root}>
            <div className={styles.subContainer}>
                <Typography weight="medium" uppercase className={styles.title}>
                    {t("title")}
                </Typography>
                <Typography
                    variant="lg"
                    weight="medium"
                    className={styles.body}
                >
                    {t("body")}
                </Typography>
                <Link href="/">
                    <Button size="small">{t("action")}</Button>
                </Link>
            </div>
        </div>
    );
}
