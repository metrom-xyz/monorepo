import type { TargetedNamedCampaign } from "@/src/types/campaign";
import type { TargetType } from "@metrom-xyz/sdk";
import type { ActionSizes } from ".";
import { RemoteLogo } from "@/src/components/remote-logo";
import { Typography } from "@metrom-xyz/ui";

interface OdysseyProps<T extends TargetType.Odyssey> extends ActionSizes {
    campaign: TargetedNamedCampaign<T>;
}

export function Odyssey<T extends TargetType.Odyssey>({
    nameSize,
    logoSize,
    campaign,
}: OdysseyProps<T>) {
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
