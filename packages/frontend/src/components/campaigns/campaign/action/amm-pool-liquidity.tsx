import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { formatPercentage } from "@/src/utils/format";
import { PoolRemoteLogo } from "@/src/components/pool-remote-logo";
import { RestrictionType, type TargetType } from "@metrom-xyz/sdk";
import type { TargetedNamedCampaign } from "@/src/types/campaign";

import styles from "./styles.module.css";

interface AmmPoolLiquidityProps {
    campaign: TargetedNamedCampaign<TargetType.AmmPoolLiquidity>;
}

export function AmmPoolLiquidity({ campaign }: AmmPoolLiquidityProps) {
    const t = useTranslations("allCampaigns");

    return (
        <div className={styles.root}>
            <PoolRemoteLogo
                chain={campaign.chainId}
                tokens={campaign.target.pool.tokens.map((token) => ({
                    address: token.address,
                    defaultText: token.symbol,
                }))}
            />
            <div className={styles.titleContainer}>
                <Typography size="lg" weight="medium" truncate>
                    {campaign.name}
                </Typography>
                {campaign.target.pool.fee && (
                    <Typography
                        size="sm"
                        weight="medium"
                        className={styles.campaignFee}
                        light
                    >
                        {formatPercentage({
                            percentage: campaign.target.pool.fee,
                            keepDust: true,
                        })}
                    </Typography>
                )}
                <div className={styles.chipsWrapper}>
                    {campaign.specification?.kpi && (
                        <div className={styles.chip}>
                            <Typography size="xs" weight="medium" uppercase>
                                {t("kpi")}
                            </Typography>
                        </div>
                    )}
                    {campaign.specification?.priceRange && (
                        <div className={styles.chip}>
                            <Typography size="xs" weight="medium" uppercase>
                                {t("pool.range")}
                            </Typography>
                        </div>
                    )}
                    {campaign.restrictions?.type ===
                        RestrictionType.Whitelist && (
                        <div className={styles.chip}>
                            <Typography size="xs" weight="medium" uppercase>
                                {t("restricted")}
                            </Typography>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
