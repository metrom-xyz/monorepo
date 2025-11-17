import { Typography } from "@metrom-xyz/ui";
import { TargetType } from "@metrom-xyz/sdk";
import { type TargetedNamedCampaign } from "@/src/types/campaign";
import { RemoteLogo } from "@/src/components/remote-logo";
import type { ActionSizes } from ".";

interface TurtleClubVaultProps<T extends TargetType.TurtleClub>
    extends ActionSizes {
    campaign: TargetedNamedCampaign<T>;
}

export function TurtleClubVault<T extends TargetType.TurtleClub>({
    nameSize,
    logoSize,
    campaign,
}: TurtleClubVaultProps<T>) {
    return (
        <>
            <RemoteLogo size={logoSize} src={campaign.target.vaultIconUrl} />
            <Typography size={nameSize} weight="medium" truncate>
                {campaign.name}
            </Typography>
        </>
    );
}
