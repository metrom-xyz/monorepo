import {
    Lv2PointsCampaign2Action,
    type ActionsGroup,
    type Lv2PointsCampaign,
} from "@/src/types/lv2-points-campaign";
import { useTranslations } from "next-intl";
import { Card, Typography } from "@metrom-xyz/ui";
import { Action } from "./action";
import { LiquidityLandChip } from "../liquidity-land-chip";
import type { SupportedLiquityV2 } from "@metrom-xyz/sdk";
import type { ChainWithType } from "@/src/types/chain";

import styles from "./styles.module.css";

interface ActionsProps {
    chain: ChainWithType;
    protocol: SupportedLiquityV2;
    pointsName: string;
    actions: Lv2PointsCampaign["actions"];
}

const GROUPED_ACTION_TYPES = [
    Lv2PointsCampaign2Action.Liquidity,
    Lv2PointsCampaign2Action.NetSwapVolume,
];

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
                <div className={styles.groupedActionsWrapper}>
                    {Object.entries(actions).map(([type, group]) => {
                        if (
                            !group ||
                            !GROUPED_ACTION_TYPES.includes(
                                type as Lv2PointsCampaign2Action,
                            )
                        )
                            return;

                        return (
                            <ActionsGroup
                                key={type}
                                group={group}
                                chain={chain}
                                protocol={protocol}
                            />
                        );
                    })}
                </div>
                {Object.entries(actions).map(([type, group]) => {
                    if (
                        !group ||
                        GROUPED_ACTION_TYPES.includes(
                            type as Lv2PointsCampaign2Action,
                        )
                    )
                        return null;

                    return (
                        <ActionsGroup
                            key={type}
                            group={group}
                            chain={chain}
                            protocol={protocol}
                        />
                    );
                })}
            </div>
        </div>
    );
}

interface ActionsGroupProps {
    group: ActionsGroup;
    protocol: SupportedLiquityV2;
    chain: ChainWithType;
}

const ActionsGroup = ({ group, protocol, chain }: ActionsGroupProps) => {
    const t = useTranslations("lv2PointsCampaignPage.actions");

    return (
        <Card className={styles.actionsGroup}>
            <div className={styles.actionsGroupHeader}>
                <Typography weight="medium" uppercase size="sm">
                    {group.title}
                </Typography>
                <Typography weight="medium" variant="tertiary">
                    {group.description}
                </Typography>
                <LiquidityLandChip boost={group.boost} protocol={protocol} />
            </div>
            {group.actions.length > 0 && (
                <div className={styles.actionsWrapper}>
                    <div className={styles.actionsListHeader}>
                        <Typography weight="medium" variant="tertiary"uppercase size="sm">
                            {t("action")}
                        </Typography>
                        <Typography weight="medium" variant="tertiary"uppercase size="sm">
                            {t("multiplier")}
                        </Typography>
                    </div>
                    <div className={styles.actionsList}>
                        {group.actions.map((action, index) => (
                            <Action key={index} chain={chain} {...action} />
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
};
