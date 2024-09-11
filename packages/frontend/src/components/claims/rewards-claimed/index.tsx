import { Typography } from "@/src/ui/typography";
import styles from "./styles.module.css";
import { Link } from "@/src/i18n/routing";
import { Button } from "@/src/ui/button";
import { useTranslations } from "next-intl";

export function RewardsClaimed() {
    const t = useTranslations("claims.rewardsClaimed");

    return (
        <div className={styles.root}>
            <div className={styles.subContainer}>
                <Typography
                    className={styles.title}
                    variant="base"
                    weight="medium"
                    uppercase
                >
                    {t("title")}
                </Typography>
                <Typography
                    className={styles.body}
                    variant="lg"
                    weight="medium"
                >
                    {t("body")}
                </Typography>
                <Link href="/">
                    <Button className={{ root: styles.button }}>
                        {t("action")}
                    </Button>
                </Link>
            </div>
        </div>
    );
}
