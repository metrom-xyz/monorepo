import { Typography, Button, Card } from "@metrom-xyz/ui";
import { Link } from "@/src/i18n/routing";
import { useTranslations } from "next-intl";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

import styles from "./styles.module.css";

export function Empty() {
    const t = useTranslations("rewards.claims");
    const { address } = useAccount();
    const { openConnectModal } = useConnectModal();

    // FIXME: fix the empty being rendered before the loading is done to avoid
    // tracking wrong events
    // useEffect(() => {
    //     trackFathomEvent("NO_REWARDS_CLAIM");
    // }, []);

    return address ? (
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
            <Button onClick={openConnectModal} size="sm">
                {t("walletNotConnected.action")}
            </Button>
        </Card>
    );
}
