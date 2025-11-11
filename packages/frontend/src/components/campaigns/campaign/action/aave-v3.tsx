import { Typography } from "@metrom-xyz/ui";
import { type AaveV3TargetType } from "@metrom-xyz/sdk";
import { type TargetedNamedCampaign } from "@/src/types/campaign";
import { RemoteLogo } from "@/src/components/remote-logo";

interface AaveV3Props<T extends AaveV3TargetType> {
    campaign: TargetedNamedCampaign<T>;
}

export function AaveV3<T extends AaveV3TargetType>({
    campaign,
}: AaveV3Props<T>) {
    return (
        <>
            <RemoteLogo
                address={campaign.target.collateral.address}
                chain={campaign.target.chainId}
            />
            <Typography size="lg" weight="medium" truncate>
                {campaign.name}
            </Typography>
        </>
    );
}
