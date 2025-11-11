import { Typography } from "@metrom-xyz/ui";
import { TargetType } from "@metrom-xyz/sdk";
import { type TargetedNamedCampaign } from "@/src/types/campaign";
import { RemoteLogo } from "@/src/components/remote-logo";
import type { ActionSizes } from ".";

interface KatanaVaultProps<T extends TargetType.KatanaVault>
    extends ActionSizes {
    campaign: TargetedNamedCampaign<T>;
}

export function KatanaVault<T extends TargetType.KatanaVault>({
    nameSize,
    logoSize,
    campaign,
}: KatanaVaultProps<T>) {
    return (
        <>
            <RemoteLogo size={logoSize} src={campaign.target.vaultIconUrl} />
            <Typography size={nameSize} weight="medium" truncate>
                {campaign.name}
            </Typography>
        </>
    );
}
