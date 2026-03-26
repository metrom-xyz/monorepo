import { Accordion, Skeleton, Typography } from "@metrom-xyz/ui";
import { AprChip } from "../../../apr-chip";
import { DistributablesType } from "@metrom-xyz/sdk";
import {
    CampaignRewardsPopover,
    SkeletonCampaignRewards,
} from "../../../campaign-rewards-popover";
import { shortenAddress } from "@/src/utils/address";
import { useTranslations } from "next-intl";
import { ItemContent } from "./content";
import { CampaignTag } from "@/src/components/campaign-tag";
import { CampaignStatus } from "../../../campaign-status";
import type { CampaignItem } from "@/src/types/campaign";
import { KpiTagPopover } from "./kpi-tag-popover";
import { Header } from "./header";

import styles from "./styles.module.css";

interface ItemProps {
    campaignItem: CampaignItem;
}

export function Item({ campaignItem }: ItemProps) {
    const t = useTranslations("campaignDetails.itemsTable");
    const { id, chainId, status, apr, from, to, specification } = campaignItem;

    const hasKpi = campaignItem.hasKpiDistribution();
    const rewards = campaignItem.isDistributing(DistributablesType.Tokens);

    return (
        <Accordion
            title={
                <>
                    <div className={styles.idColumn}>
                        <Typography weight="medium">
                            {shortenAddress(id, true)}
                        </Typography>
                        {hasKpi && (
                            <KpiTagPopover campaignItem={campaignItem} />
                        )}
                        {specification?.priceRange && (
                            <CampaignTag size="sm" text={t("range")} />
                        )}
                    </div>
                    <CampaignStatus
                        variant="short"
                        from={from}
                        to={to}
                        status={status}
                    />
                    <AprChip
                        apr={apr}
                        kpi={hasKpi}
                        campaign={campaignItem}
                        placeholder
                    />
                    {rewards && (
                        <CampaignRewardsPopover
                            logoSize="xs"
                            hideSymbol
                            hideOnExpired
                            status={status}
                            chainId={chainId}
                            distributables={campaignItem.distributables}
                        />
                    )}
                </>
            }
            iconPlacement="right"
            className={styles.accordion}
        >
            <div className={styles.content}>
                <Header campaignItem={campaignItem} />
                <ItemContent campaignItem={campaignItem} />
            </div>
        </Accordion>
    );
}

export function SkeletonItem() {
    return (
        <div className={styles.skeleton}>
            <div className={styles.idColumn}>
                <Skeleton width={120} size="sm" />
                <Skeleton width={40} size="sm" />
            </div>
            <div className={styles.skeletonStatus}>
                <Skeleton width={12} circular />
                <Skeleton width={90} size="sm" />
            </div>
            <Skeleton width={90} size="xl2" />
            <SkeletonCampaignRewards />
        </div>
    );
}
