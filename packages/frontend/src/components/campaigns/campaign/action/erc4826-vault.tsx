import type {
    TargetedNamedCampaign,
    Campaign,
} from "@/src/types/campaign/common";
import type { TargetType } from "@metrom-xyz/sdk";
import type { ActionSizes } from ".";
import { RemoteLogo } from "@/src/components/remote-logo";
import { Typography } from "@metrom-xyz/ui";

interface Erc4626VaultProps<
    T extends TargetType.Erc4626Vault,
> extends ActionSizes {
    campaign: TargetedNamedCampaign<T, Campaign>;
}

export function Erc4626Vault<T extends TargetType.Erc4626Vault>({
    nameSize,
    logoSize,
    campaign,
}: Erc4626VaultProps<T>) {
    return (
        <>
            <RemoteLogo
                size={logoSize}
                address={campaign.target.vault.asset}
                chain={campaign.target.chainId}
            />
            <Typography size={nameSize} weight="medium" truncate>
                {campaign.name}
            </Typography>
        </>
    );
}
