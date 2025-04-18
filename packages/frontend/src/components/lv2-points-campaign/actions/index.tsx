import type { Lv2PointsCampaign } from "@/src/types/lv2-points-campaign";
import { useTranslations } from "next-intl";
import { Card, Typography } from "@metrom-xyz/ui";
import { RemoteLogo } from "../../remote-logo";
import { PoolRemoteLogo } from "../../pool-remote-logo";
import type { SupportedChain } from "@metrom-xyz/contracts";

import styles from "./styles.module.css";

interface ActionsProps {
    chain: SupportedChain;
    actions: Lv2PointsCampaign["actions"];
}

export function Actions({ chain, actions }: ActionsProps) {
    const t = useTranslations("lv2PointsCampaignPage.actions");

    return (
        <div className={styles.root}>
            <Typography size="lg" weight="medium" uppercase>
                {t("title")}
            </Typography>
            <div className={styles.actionGroupsWrapper}>
                {Object.entries(actions).map(([type, group]) => (
                    <Card key={type} className={styles.actionsGroup}>
                        <div className={styles.actionsGroupHeader}>
                            <Typography weight="medium" uppercase size="sm">
                                {group.title}
                            </Typography>
                            <Typography weight="medium" light>
                                {group.description}
                            </Typography>
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
                                    <div key={index} className={styles.action}>
                                        <div className={styles.actionTarget}>
                                            {action.targets.length === 1 ? (
                                                <RemoteLogo
                                                    size="sm"
                                                    chain={chain}
                                                    address={action.targets[0]}
                                                />
                                            ) : (
                                                <PoolRemoteLogo
                                                    size="sm"
                                                    chain={chain}
                                                    tokens={action.targets.map(
                                                        (target) => ({
                                                            address: target,
                                                        }),
                                                    )}
                                                />
                                            )}
                                            <div className={styles.actionText}>
                                                <Typography weight="medium">
                                                    {action.name}
                                                </Typography>
                                                {action.description && (
                                                    <Typography
                                                        weight="medium"
                                                        light
                                                        uppercase
                                                        size="xs"
                                                    >
                                                        {action.description}
                                                    </Typography>
                                                )}
                                            </div>
                                        </div>
                                        <Typography weight="medium">
                                            {`${action.multiplier}x`}
                                        </Typography>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
