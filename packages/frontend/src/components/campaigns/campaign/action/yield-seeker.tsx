import type { TargetType } from "@metrom-xyz/sdk";
import type { ActionSizes } from ".";
import type { TargetedNamedCampaign } from "@/src/types/campaign";
import { Typography } from "@metrom-xyz/ui";

interface YieldSeekerProps<T extends TargetType.YieldSeeker>
    extends ActionSizes {
    campaign: TargetedNamedCampaign<T>;
}

export function YieldSeeker<T extends TargetType.YieldSeeker>({
    nameSize,
    campaign,
}: YieldSeekerProps<T>) {
    return (
        <Typography size={nameSize} weight="medium" truncate>
            {campaign.name}
        </Typography>
    );
}
