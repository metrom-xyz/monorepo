import { Typography } from "@metrom-xyz/ui";
import { TargetType } from "@metrom-xyz/sdk";
import type {
    Campaign,
    TargetedNamedCampaign,
} from "@/src/types/campaign/common";
import { RemoteLogo } from "@/src/components/remote-logo";
import type { ActionSizes } from ".";

interface HoldFungibleAssetProps<
    T extends TargetType.HoldFungibleAsset,
> extends ActionSizes {
    campaign: TargetedNamedCampaign<T, Campaign>;
}

export function HoldFungibleAsset<T extends TargetType.HoldFungibleAsset>({
    nameSize,
    logoSize,
    campaign,
}: HoldFungibleAssetProps<T>) {
    return (
        <>
            <RemoteLogo
                size={logoSize}
                address={campaign.target.asset.address}
                chain={campaign.target.chainId}
            />
            <Typography size={nameSize} weight="medium" truncate>
                {campaign.name}
            </Typography>
        </>
    );
}
