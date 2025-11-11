import { Typography } from "@metrom-xyz/ui";
import { TargetType } from "@metrom-xyz/sdk";
import { type TargetedNamedCampaign } from "@/src/types/campaign";
import type { ActionSizes } from ".";

interface GmxV1LiquidityProps<T extends TargetType.GmxV1Liquidity>
    extends ActionSizes {
    campaign: TargetedNamedCampaign<T>;
}

export function GmxV1Liquidity<T extends TargetType.GmxV1Liquidity>({
    nameSize,
    campaign,
}: GmxV1LiquidityProps<T>) {
    return (
        <Typography size={nameSize} weight="medium" truncate>
            {campaign.name}
        </Typography>
    );
}
