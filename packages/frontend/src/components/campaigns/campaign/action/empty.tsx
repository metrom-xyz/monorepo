import { Typography } from "@metrom-xyz/ui";
import { TargetType } from "@metrom-xyz/sdk";
import { type TargetedNamedCampaign } from "@/src/types/campaign";

interface EmptyProps<T extends TargetType.Empty> {
    campaign: TargetedNamedCampaign<T>;
}

export function Empty<T extends TargetType.Empty>({ campaign }: EmptyProps<T>) {
    return (
        <Typography size="lg" weight="medium" truncate>
            {campaign.name}
        </Typography>
    );
}
