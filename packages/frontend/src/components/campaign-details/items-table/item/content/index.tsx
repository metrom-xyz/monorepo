import type { CampaignItem } from "@/src/types/campaign";
import { Tabs, UnderlinedTab } from "@metrom-xyz/ui";
import { useEffect, useMemo, useState } from "react";
import type { TranslationsKeys } from "@/src/types/utils";
import { useTranslations } from "next-intl";
import { Kpi } from "../kpi";
import { DistributablesType, TargetType } from "@metrom-xyz/sdk";
import { PriceRange } from "../price-range";
import { Leaderboard } from "@/src/components/leaderboard";
import { useLeaderboard } from "@/src/hooks/useLeaderboard";
import { Restrictions } from "../restrictions";

import styles from "./styles.module.css";

interface ItemContentProps {
    campaignItem: CampaignItem;
}

enum TabType {
    Kpi = "kpi",
    Leaderboard = "leaderboard",
    Range = "range",
    Restrictions = "restrictions",
}

const TABS: {
    type: TabType;
    label: TranslationsKeys<"campaignDetails.itemsTable.campaignItem.tabs">;
}[] = [
    {
        type: TabType.Kpi,
        label: "kpi",
    },
    {
        type: TabType.Range,
        label: "priceRange",
    },
    {
        type: TabType.Leaderboard,
        label: "leaderboard",
    },
    {
        type: TabType.Restrictions,
        label: "addressRestrictions",
    },
];

export function ItemContent({ campaignItem }: ItemContentProps) {
    const [tab, setTab] = useState<TabType>();

    const t = useTranslations("campaignDetails.itemsTable.campaignItem");

    const { loading: loadingLeaderboard, leaderboard } = useLeaderboard({
        campaignId: campaignItem.id,
        chainId: campaignItem.chainId,
        chainType: campaignItem.chainType,
        enabled: tab === TabType.Leaderboard,
    });

    const tabOptions = useMemo(
        () =>
            TABS.filter(({ type }) => {
                const { specification } = campaignItem;

                if (type === TabType.Kpi) return !!campaignItem.hasKpiDistribution();
                if (type === TabType.Range) return !!specification?.priceRange;
                if (type === TabType.Restrictions)
                    return (
                        !!specification?.whitelist || specification?.blacklist
                    );
                return true;
            }),
        [campaignItem],
    );

    useEffect(() => {
        if (tab) return;
        setTab(tabOptions[0].type);
    }, [tabOptions, tab]);

    const tokensItem = campaignItem.isDistributing(DistributablesType.Tokens);
    const ammPoolLiquidityItem = campaignItem.isTargeting(TargetType.AmmPoolLiquidity);

    return (
        <div>
            <Tabs
                value={tab}
                onChange={setTab}
                size="sm"
                className={styles.tabs}
            >
                {tabOptions.map(({ type, label }) => (
                    <UnderlinedTab key={type} value={type}>
                        {t(`tabs.${label}`)}
                    </UnderlinedTab>
                ))}
            </Tabs>
            <div className={styles.tabContentWrapper}>
                {tab === TabType.Kpi && tokensItem && <Kpi campaignItem={campaignItem} />}
                {tab === TabType.Range && ammPoolLiquidityItem && (
                    <PriceRange campaignItem={campaignItem} />
                )}
                {tab === TabType.Leaderboard && (
                    <Leaderboard
                        campaignItem={campaignItem}
                        leaderboard={leaderboard}
                        loading={loadingLeaderboard}
                    />
                )}
                {tab === TabType.Restrictions && campaignItem.restrictions && (
                    <Restrictions {...campaignItem.restrictions} />
                )}
            </div>
        </div>
    );
}
