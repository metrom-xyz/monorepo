import { useTranslations } from "next-intl";
import { Typography } from "@metrom-xyz/ui";
import { PoolRemoteLogo } from "@/src/components/pool-remote-logo";
import { getAmmPoolLiquidityCampaignPreviewName } from "@/src/utils/campaign";
import type { AmmPoolLiquidityCampaignPayload } from "@/src/types/campaign/amm-pool-liquidity-campaign";
import { formatPercentage } from "@/src/utils/format";
import { useChainData } from "@/src/hooks/useChainData";

import styles from "./styles.module.css";

interface AmmLiquidityPoolTargetProps {
    payload: AmmPoolLiquidityCampaignPayload | null;
}

export function AmmLiquidityPoolTarget({
    payload,
}: AmmLiquidityPoolTargetProps) {
    const globalT = useTranslations();
    const t = useTranslations("newCampaign.formPreview");
    const chainData = useChainData({
        chainId: payload?.pool?.chainId,
        chainType: payload?.pool?.chainType,
    });

    if (
        !payload ||
        !payload.chainId ||
        !payload.pool ||
        !payload.kind ||
        !chainData
    )
        return null;

    const ChainLogo = chainData.icon;

    return (
        <div className={styles.root}>
            <Typography size="xs" weight="medium" variant="tertiary">
                {t("target")}
            </Typography>
            <div className={styles.poolIdentity}>
                <ChainLogo className={styles.chainIcon} />
                <PoolRemoteLogo
                    size="xxs"
                    chain={payload.pool.chainId}
                    tokens={payload.pool.tokens.map((token) => ({
                        address: token.address,
                        defaultText: token.symbol,
                    }))}
                />
                <Typography size="sm" weight="medium" noWrap truncate>
                    {getAmmPoolLiquidityCampaignPreviewName(
                        globalT,
                        payload.kind,
                        payload.pool,
                    )}
                </Typography>
                {payload.pool.fee && (
                    <Typography size="xs" weight="medium" variant="tertiary">
                        {formatPercentage({
                            percentage: payload.pool.fee,
                            keepDust: true,
                        })}
                    </Typography>
                )}
            </div>
        </div>
    );
}
