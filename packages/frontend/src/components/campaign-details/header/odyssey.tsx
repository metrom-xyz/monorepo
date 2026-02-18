import { InfoTooltip, Typography } from "@metrom-xyz/ui";
import { TargetType } from "@metrom-xyz/sdk";
import type {
    TargetedNamedCampaign,
    CampaignDetails,
} from "@/src/types/campaign/common";
import { Tags } from "./tags";
import { RemoteLogo } from "../../remote-logo";

import styles from "./styles.module.css";

interface OdysseyHeaderProps {
    campaignDetails: TargetedNamedCampaign<TargetType.Odyssey, CampaignDetails>;
}

export function OdysseyHeader({ campaignDetails }: OdysseyHeaderProps) {
    const { chainData, name, target } = campaignDetails;
    const ChainIcon = chainData?.icon;

    return (
        <div className={styles.titleContainer}>
            <div className={styles.title}>
                {ChainIcon && (
                    <InfoTooltip
                        icon={<ChainIcon className={styles.chainLogo} />}
                    >
                        <Typography size="sm">{chainData.name}</Typography>
                    </InfoTooltip>
                )}
                <RemoteLogo
                    size="lg"
                    address={target.asset.address}
                    chain={target.chainId}
                />
                <Typography size="xl3" weight="medium">
                    {name}
                </Typography>
            </div>
            <Tags campaignDetails={campaignDetails} />
        </div>
    );
}
