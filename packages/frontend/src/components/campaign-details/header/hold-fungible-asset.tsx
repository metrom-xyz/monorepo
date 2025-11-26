import { InfoTooltip, Typography } from "@metrom-xyz/ui";
import { TargetType } from "@metrom-xyz/sdk";
import { type TargetedNamedCampaign } from "@/src/types/campaign";
import { RemoteLogo } from "../../remote-logo";
import { trackFathomEvent } from "@/src/utils/fathom";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { getFungibleAssetExplorerLink } from "@/src/utils/explorer";
import { Tags } from "./tags";
import classNames from "classnames";

import styles from "./styles.module.css";

interface HoldFungibleAssetProps {
    campaign: TargetedNamedCampaign<TargetType.HoldFungibleAsset>;
}

export function HoldFungibleAsset({ campaign }: HoldFungibleAssetProps) {
    const ChainIcon = campaign.chainData?.icon;
    const explorerLink = getFungibleAssetExplorerLink(
        campaign.target.asset.address,
        campaign.target.chainId,
        campaign.target.chainType,
    );

    function handleExploreOnClick() {
        trackFathomEvent("CLICK_FUNGIBLE_ASSET_EXPLORE");
    }

    return (
        <>
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
                    <a
                        href={explorerLink}
                        onClick={handleExploreOnClick}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <ArrowRightIcon
                            className={classNames(
                                styles.externalLinkIcon,
                                styles.explore,
                            )}
                        />
                    </a>
                </div>
                <Tags campaign={campaign} />
            </div>
        </>
    );
}
