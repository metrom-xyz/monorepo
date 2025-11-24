import { Typography } from "@metrom-xyz/ui";
import { TargetType } from "@metrom-xyz/sdk";
import { type TargetedNamedCampaign } from "@/src/types/campaign";
import { RemoteLogo } from "@/src/components/remote-logo";
import type { ActionSizes } from ".";

interface TurtleVaultProps<T extends TargetType.Turtle> extends ActionSizes {
    campaign: TargetedNamedCampaign<T>;
}

export function TurtleVault<T extends TargetType.Turtle>({
    nameSize,
    logoSize,
    campaign,
}: TurtleVaultProps<T>) {
    return (
        <>
            <RemoteLogo size={logoSize} src={campaign.target.iconUrl} />
            <Typography size={nameSize} weight="medium" truncate>
                {campaign.name}
            </Typography>
        </>
    );
}
