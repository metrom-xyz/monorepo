import { Typography } from "@metrom-xyz/ui";
import { TargetType } from "@metrom-xyz/sdk";
import { type TargetedNamedCampaign } from "@/src/types/campaign";

interface GmxV1LiquidityProps<T extends TargetType.GmxV1Liquidity> {
    campaign: TargetedNamedCampaign<T>;
}

export function GmxV1Liquidity<T extends TargetType.GmxV1Liquidity>({
    campaign,
}: GmxV1LiquidityProps<T>) {
    return (
        <Typography size="lg" weight="medium" truncate>
            {campaign.name}
        </Typography>
    );
}
