import { Typography } from "@metrom-xyz/ui";
import { TargetType } from "@metrom-xyz/sdk";
import { type TargetedNamedCampaign } from "@/src/types/campaign";
import { RemoteLogo } from "@/src/components/remote-logo";

interface KatanaVaultProps<T extends TargetType.KatanaVault> {
    campaign: TargetedNamedCampaign<T>;
}

export function KatanaVault<T extends TargetType.KatanaVault>({
    campaign,
}: KatanaVaultProps<T>) {
    return (
        <>
            <RemoteLogo
                src={campaign.target.vaultIconUrl}
                className="rounded-full!"
            />
            <Typography size="lg" weight="medium" truncate>
                {campaign.name}
            </Typography>
        </>
    );
}
