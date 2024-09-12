import { Typography } from "@/src/ui/typography";
import { Link } from "@/src/i18n/routing";
import { Button } from "@/src/ui/button";
import { useTranslations } from "next-intl";

import styles from "./styles.module.css";

export function Empty() {
    const t = useTranslations("claims.empty");

    // FIXME: fix the empty being rendered before the loading is done to avoid
    // tracking wrong events
    // useEffect(() => {
    //     trackFathomEvent("NO_REWARDS_CLAIM");
    // }, []);

    return (
        <div className={styles.root}>
            <Typography weight="medium" uppercase className={styles.title}>
                {t("title")}
            </Typography>
            <Typography variant="lg" weight="medium" className={styles.body}>
                {t("body")}
            </Typography>
            <Link href="/">
                <Button size="small">{t("action")}</Button>
            </Link>
        </div>
    );
}
