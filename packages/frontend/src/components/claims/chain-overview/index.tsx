import { Button, Skeleton, Card } from "@metrom-xyz/ui";
import type { ChainWithRewardsData } from "..";
import { useTranslations } from "next-intl";
import { APTOS } from "@/src/commons/env";
import { ChainOverviewEvm } from "./chain-overview-evm";
import { ChainOverviewMvm } from "./chain-overview-mvm";

import styles from "./styles.module.css";

export interface ChainOverviewProps {
    className?: string;
    chainWithRewardsData: ChainWithRewardsData;
    onClaimAll: () => void;
    onRecoverAll: () => void;
    onClaiming?: (value: boolean) => void;
    onRecovering?: (value: boolean) => void;
}

export function ChainOverview(props: ChainOverviewProps) {
    if (APTOS) return <ChainOverviewMvm {...props} />;
    return <ChainOverviewEvm {...props} />;
}

export function SkeletonChainOverview() {
    const t = useTranslations("rewards");

    return (
        <Card className={styles.root}>
            <div className={styles.chainNameWrapper}>
                <Skeleton className={styles.chainIcon} />
                <Skeleton width={100} size="xl3" />
                <Skeleton width={50} size="xl2" />
            </div>
            <Button size="sm" loading>
                {t("claims.loading")}
            </Button>
        </Card>
    );
}
