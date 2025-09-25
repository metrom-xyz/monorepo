import { formatPercentage } from "@/src/utils/format";
import { Typography } from "@metrom-xyz/ui";
import { type AmmPoolLiquidityCampaignPreviewPayload } from "@/src/types/campaign";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { PoolRemoteLogo } from "@/src/components/pool-remote-logo";
import { getCampaignPreviewName } from "@/src/utils/campaign";
import { useTranslations } from "next-intl";

interface AmmPoolLiquidityProps {
    payload: AmmPoolLiquidityCampaignPreviewPayload;
}

export function AmmPoolLiquidity({ payload }: AmmPoolLiquidityProps) {
    const t = useTranslations();
    const { id: chainId } = useChainWithType();

    return (
        <>
            <PoolRemoteLogo
                size="lg"
                chain={chainId}
                tokens={payload.pool.tokens.map((token) => ({
                    address: token.address,
                    defaultText: token.symbol,
                }))}
            />
            <Typography size="xl" weight="medium" noWrap truncate>
                {getCampaignPreviewName(t, payload)}
            </Typography>
            {payload.pool.fee && (
                <Typography size="lg" weight="medium" light>
                    {formatPercentage({
                        percentage: payload.pool.fee,
                        keepDust: true,
                    })}
                </Typography>
            )}
        </>
    );
}
