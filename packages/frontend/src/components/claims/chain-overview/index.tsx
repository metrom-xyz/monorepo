import { Button, Skeleton, Card } from "@metrom-xyz/ui";
import type { ChainWithRewardsData } from "..";
import { useTranslations } from "next-intl";
import { ChainOverviewEvm } from "./chain-overview-evm";
import { ChainOverviewMvm } from "./chain-overview-mvm";
import { useChainType } from "@/src/hooks/useChainType";
import { ChainType } from "@metrom-xyz/sdk";
import { ChainOverviewSvm } from "./chain-overview-svm";

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
    const chainType = useChainType();

    switch (chainType) {
        case ChainType.Evm:
            return <ChainOverviewEvm {...props} />;
        case ChainType.Aptos:
            return <ChainOverviewMvm {...props} />;
        case ChainType.Svm:
            return <ChainOverviewSvm {...props} />;
        default:
            return null;
    }
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
            <Button size="sm" loading iconPlacement="right">
                {t("claims.loading")}
            </Button>
        </Card>
    );
}
