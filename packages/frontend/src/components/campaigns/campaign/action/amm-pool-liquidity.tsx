import { Typography } from "@metrom-xyz/ui";
import { formatPercentage } from "@/src/utils/format";
import { PoolRemoteLogo } from "@/src/components/pool-remote-logo";
import { type AmmPoolLiquidityTargetType } from "@metrom-xyz/sdk";
import type { TargetedNamedCampaign } from "@/src/types/campaign";
import type { ActionSizes } from ".";

interface AmmPoolLiquidityProps<T extends AmmPoolLiquidityTargetType>
    extends ActionSizes {
    campaign: TargetedNamedCampaign<T>;
}

export function AmmPoolLiquidity<T extends AmmPoolLiquidityTargetType>({
    campaign,
    nameSize,
    logoSize,
}: AmmPoolLiquidityProps<T>) {
    return (
        <>
            <PoolRemoteLogo
                size={logoSize}
                chain={campaign.chainId}
                tokens={campaign.target.pool.tokens.map((token) => ({
                    address: token.address,
                    defaultText: token.symbol,
                }))}
            />
            <Typography size={nameSize} weight="medium" truncate>
                {campaign.name}
            </Typography>
            {campaign.target.pool.fee && (
                <Typography size="sm" weight="medium" variant="tertiary">
                    {formatPercentage({
                        percentage: campaign.target.pool.fee,
                        keepDust: true,
                    })}
                </Typography>
            )}
        </>
    );
}
