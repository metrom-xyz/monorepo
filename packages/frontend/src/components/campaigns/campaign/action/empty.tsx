import { Typography } from "@metrom-xyz/ui";
import { TargetType } from "@metrom-xyz/sdk";
import { type TargetedNamedCampaign } from "@/src/types/campaign/common";
import type { ActionSizes } from ".";

interface EmptyProps<T extends TargetType.Empty> extends ActionSizes {
    campaign: TargetedNamedCampaign<T>;
}

export function Empty<T extends TargetType.Empty>({
    campaign,
    nameSize,
}: EmptyProps<T>) {
    return (
        <Typography size={nameSize} weight="medium" truncate>
            {campaign.name}
        </Typography>
    );
}
