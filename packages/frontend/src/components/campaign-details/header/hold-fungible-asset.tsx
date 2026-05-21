import { InfoTooltip, Typography } from "@metrom-xyz/ui";
import { TargetType } from "@metrom-xyz/sdk";
import type {
    TargetedNamedCampaign,
    CampaignDetails,
} from "@/src/types/campaign/common";
import { RemoteLogo } from "../../remote-logo";
import { trackUmamiEvent } from "@/src/utils/umami";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { getFungibleAssetExplorerLink } from "@/src/utils/explorer";
import { Tags } from "./tags";
import classNames from "classnames";

import styles from "./styles.module.css";

interface HoldFungibleAssetProps {
    campaignDetails: TargetedNamedCampaign<
        TargetType.HoldFungibleAsset,
        CampaignDetails
    >;
}

export function HoldFungibleAsset({ campaignDetails }: HoldFungibleAssetProps) {
    const { chainData, name, target } = campaignDetails;
    const ChainIcon = chainData?.icon;
    const explorerLink = getFungibleAssetExplorerLink(
        target.asset.address,
        target.chainId,
        target.chainType,
    );

    function handleExploreOnClick() {
        trackUmamiEvent("click-fungible-asset-explore");
    }

    return (
        <>
            <div className={styles.titleContainer}>
                <div className={styles.title}>
                    <div className={styles.icons}>
                        {ChainIcon && (
                            <InfoTooltip
                                icon={
                                    <ChainIcon className={styles.chainLogo} />
                                }
                            >
                                <Typography size="sm">
                                    {chainData.name}
                                </Typography>
                            </InfoTooltip>
                        )}
                        <RemoteLogo
                            size="lg"
                            address={target.asset.address}
                            chain={target.chainId}
                        />
                    </div>
                    <div className={styles.name}>
                        <Typography
                            size="xl3"
                            weight="medium"
                            className={styles.nameTypography}
                        >
                            {name}
                        </Typography>
                    </div>
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
                <Tags campaignDetails={campaignDetails} />
            </div>
        </>
    );
}
