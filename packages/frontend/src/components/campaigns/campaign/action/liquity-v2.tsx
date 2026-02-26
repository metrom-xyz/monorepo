import { Typography } from "@metrom-xyz/ui";
import { type LiquityV2TargetType } from "@metrom-xyz/sdk";
import { type TargetedNamedCampaign } from "@/src/types/campaign/common";
import { RemoteLogo } from "@/src/components/remote-logo";
import type { ActionSizes } from ".";

interface LiquityV2Props<T extends LiquityV2TargetType> extends ActionSizes {
    campaign: TargetedNamedCampaign<T>;
}

export function LiquityV2<T extends LiquityV2TargetType>({
    nameSize,
    logoSize,
    campaign,
}: LiquityV2Props<T>) {
    return (
        <>
            <RemoteLogo
                size={logoSize}
                address={campaign.target.collateral.address}
                chain={campaign.target.chainId}
            />
            <Typography size={nameSize} weight="medium" truncate>
                {campaign.name}
            </Typography>
        </>
    );
}
