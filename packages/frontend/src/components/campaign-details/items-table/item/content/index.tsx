import type { AggregatedCampaignItem } from "@/src/types/campaign";
import { Tabs, UnderlinedTab } from "@metrom-xyz/ui";
import { useEffect, useMemo, useState } from "react";
import type { TranslationsKeys } from "@/src/types/utils";
import { useTranslations } from "next-intl";
import { Kpi } from "../kpi";
import { DistributablesType, TargetType } from "@metrom-xyz/sdk";
import { PriceRange } from "../price-range";
import { Leaderboard } from "@/src/components/leaderboard";
import { useLeaderboard } from "@/src/hooks/useLeaderboard";

import styles from "./styles.module.css";
import { Restrictions } from "../restrictions";

interface ItemContentProps {
    item: AggregatedCampaignItem;
}

enum TabType {
    Kpi = "kpi",
    Leaderboard = "leaderboard",
    Range = "range",
    Restrictions = "restrictions",
}

const TABS: {
    type: TabType;
    label: TranslationsKeys<"campaignDetails.itemsTable.item.tabs">;
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

export function ItemContent({ item }: ItemContentProps) {
    const [tab, setTab] = useState<TabType>();

    const t = useTranslations("campaignDetails.itemsTable.item");

    const { loading: loadingLeaderboard, leaderboard } = useLeaderboard({
        campaignId: item.id,
        chainId: item.chainId,
        chainType: item.chainType,
        enabled: tab === TabType.Leaderboard,
    });

    const tabOptions = useMemo(
        () =>
            TABS.filter(({ type }) => {
                const { specification } = item;

                if (type === TabType.Kpi) return !!item.hasKpiDistribution();
                if (type === TabType.Range) return !!specification?.priceRange;
                if (type === TabType.Restrictions)
                    return (
                        !!specification?.whitelist || specification?.blacklist
                    );
                return true;
            }),
        [item],
    );

    useEffect(() => {
        if (tab) return;
        setTab(tabOptions[0].type);
    }, [tabOptions, tab]);

    const tokensItem = item.isDistributing(DistributablesType.Tokens);
    const ammPoolLiquidityItem = item.isTargeting(TargetType.AmmPoolLiquidity);

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
                {tab === TabType.Kpi && tokensItem && <Kpi item={item} />}
                {tab === TabType.Range && ammPoolLiquidityItem && (
                    <PriceRange campaign={item} />
                )}
                {tab === TabType.Leaderboard && (
                    <Leaderboard
                        chainId={item.chainId}
                        chainType={item.chainType}
                        restrictions={item.restrictions}
                        // distributablesType={item.distributables.type}
                        leaderboard={leaderboard}
                        loading={loadingLeaderboard}
                    />
                )}
                {tab === TabType.Restrictions && item.restrictions && (
                    <Restrictions {...item.restrictions} />
                )}
            </div>
        </div>
    );
}
