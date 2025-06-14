import type { Lv2PointsCampaign } from "@/src/types/lv2-points-campaign";
import { useTranslations } from "next-intl";
import { Card, Typography } from "@metrom-xyz/ui";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { Action } from "./action";
import { LiquidityLandChip } from "../liquidity-land-chip";
import type { SupportedLiquityV2 } from "@metrom-xyz/sdk";

import styles from "./styles.module.css";

interface ActionsProps {
    chain: SupportedChain;
    protocol: SupportedLiquityV2;
    pointsName: string;
    actions: Lv2PointsCampaign["actions"];
}

export function Actions({
    chain,
    protocol,
    pointsName,
    actions,
}: ActionsProps) {
    const t = useTranslations("lv2PointsCampaignPage.actions");

    return (
        <div className={styles.root}>
            <Typography size="lg" weight="medium" uppercase>
                {t("title", { points: pointsName })}
            </Typography>
            <div className={styles.actionGroupsWrapper}>
                {Object.entries(actions).map(([type, group]) => {
                    if (!group) return;

                    return (
                        <Card key={type} className={styles.actionsGroup}>
                            <div className={styles.actionsGroupHeader}>
                                <Typography weight="medium" uppercase size="sm">
                                    {group.title}
                                </Typography>
                                <Typography weight="medium" light>
                                    {group.description}
                                </Typography>
                                <LiquidityLandChip
                                    boost={group.boost}
                                    protocol={protocol}
                                />
                            </div>
                            <div className={styles.actionsWrapper}>
                                <div className={styles.actionsListHeader}>
                                    <Typography
                                        weight="medium"
                                        light
                                        uppercase
                                        size="sm"
                                    >
                                        {t("action")}
                                    </Typography>
                                    <Typography
                                        weight="medium"
                                        light
                                        uppercase
                                        size="sm"
                                    >
                                        {t("multiplier")}
                                    </Typography>
                                </div>
                                <div className={styles.actionsList}>
                                    {group.actions.map((action, index) => (
                                        <Action
                                            key={index}
                                            chain={chain}
                                            {...action}
                                        />
                                    ))}
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
