import { Skeleton, Button } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { PoolRemoteLogo } from "../../pool-remote-logo";
import type { NamedCampaign } from "@/src/types";
import { AmmPoolLiquityHeader } from "./amm-pool-liquitidy copy";
import { TargetType } from "@metrom-xyz/sdk";
import { LiquityV2Header } from "./liquity-v2";

import styles from "./styles.module.css";

interface HeaderProps {
    campaign: NamedCampaign;
}

export function Header({ campaign }: HeaderProps) {
    return (
        <div className={styles.root}>
            {campaign.isTargeting(TargetType.AmmPoolLiquidity) && (
                <AmmPoolLiquityHeader campaign={campaign} />
            )}
            {campaign.isTargeting(TargetType.LiquityV2Debt) && (
                <LiquityV2Header campaign={campaign} />
            )}
        </div>
    );
}

export function SkeletonHeader() {
    const t = useTranslations("campaignDetails.header");

    return (
        <div className={styles.root}>
            <div className={styles.titleContainer}>
                <div className={styles.title}>
                    <PoolRemoteLogo
                        tokens={[{ address: "0x1" }, { address: "0x2" }]}
                        loading
                        size="xl"
                    />
                    <Skeleton size="xl4" width={400} />
                    <Skeleton size="lg" width={60} />
                </div>
                <Skeleton size="sm" width={125} />
            </div>
            <div className={styles.actionsContainer}>
                <div className={styles.leftActions}>
                    <Button size="sm" loading>
                        {t("deposit")}
                    </Button>
                    <Button size="sm" loading>
                        {t("claim")}
                    </Button>
                    <Button
                        size="sm"
                        variant="secondary"
                        border={false}
                        loading
                    >
                        {t("explorer")}
                    </Button>
                </div>
            </div>
        </div>
    );
}
