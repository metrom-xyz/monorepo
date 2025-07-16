import { Typography, Button, Card } from "@metrom-xyz/ui";
import { Link } from "@/src/i18n/routing";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { trackFathomEvent } from "@/src/utils/fathom";
import { useAppKit } from "@reown/appkit/react";
import { useAccount } from "@/src/hooks/use-account/useAccount";

import styles from "./styles.module.css";

export function Empty() {
    const t = useTranslations("rewards.claims");
    const { address } = useAccount();
    const { open } = useAppKit();

    useEffect(() => {
        trackFathomEvent("NO_REWARDS_CLAIM");
    }, []);

    async function handleOnConnect() {
        await open();
    }

    return !!address ? (
        <Card className={styles.root}>
            <Typography weight="medium" uppercase className={styles.title}>
                {t("empty.title")}
            </Typography>
            <Typography size="lg" weight="medium" className={styles.body}>
                {t("empty.body")}
            </Typography>
            <Link href="/">
                <Button size="sm">{t("empty.action")}</Button>
            </Link>
        </Card>
    ) : (
        <Card className={styles.root}>
            <Typography weight="medium" uppercase className={styles.title}>
                {t("walletNotConnected.title")}
            </Typography>
            <Typography size="lg" weight="medium" className={styles.body}>
                {t("walletNotConnected.body")}
            </Typography>
            <Button onClick={handleOnConnect} size="sm">
                {t("walletNotConnected.action")}
            </Button>
        </Card>
    );
}
