import { Typography } from "@metrom-xyz/ui";
import { type AaveV3TargetType } from "@metrom-xyz/sdk";
import { type TargetedNamedCampaign } from "@/src/types/campaign/common";
import { RemoteLogo } from "@/src/components/remote-logo";
import type { ActionSizes } from ".";

interface AaveV3Props<T extends AaveV3TargetType> extends ActionSizes {
    campaign: TargetedNamedCampaign<T>;
}

export function AaveV3<T extends AaveV3TargetType>({
    campaign,
    nameSize,
    logoSize,
}: AaveV3Props<T>) {
    return (
        <>
            <RemoteLogo
                size={logoSize}
                address={campaign.target.collateral.address}
                chain={campaign.target.chainId}
            />
            <Typography size={nameSize} weight="medium" noWrap>
                {campaign.name}
            </Typography>
        </>
    );
}
