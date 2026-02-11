import { InfoTooltip, Typography } from "@metrom-xyz/ui";
import { TargetType } from "@metrom-xyz/sdk";
import { type TargetedNamedCampaign } from "@/src/types/campaign";
import { Tags } from "./tags";
import { RemoteLogo } from "../../remote-logo";

import styles from "./styles.module.css";

interface OdysseyHeaderProps {
    campaign: TargetedNamedCampaign<TargetType.Odyssey>;
}

export function OdysseyHeader({ campaign }: OdysseyHeaderProps) {
    const ChainIcon = campaign.chainData?.icon;

    return (
        <div className={styles.titleContainer}>
            <div className={styles.title}>
                {ChainIcon && (
                    <InfoTooltip
                        icon={<ChainIcon className={styles.chainLogo} />}
                    >
                        <Typography size="sm">
                            {campaign.chainData.name}
                        </Typography>
                    </InfoTooltip>
                )}
                <RemoteLogo
                    size="lg"
                    address={campaign.target.asset.address}
                    chain={campaign.target.chainId}
                />
                <Typography size="xl3" weight="medium">
                    {campaign.name}
                </Typography>
            </div>
            <Tags campaign={campaign} />
        </div>
    );
}
