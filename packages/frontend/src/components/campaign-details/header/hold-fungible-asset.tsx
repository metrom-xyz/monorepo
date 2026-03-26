import { InfoTooltip, Typography } from "@metrom-xyz/ui";
import { TargetType } from "@metrom-xyz/sdk";
import { RemoteLogo } from "../../remote-logo";
import { trackFathomEvent } from "@/src/utils/fathom";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { getFungibleAssetExplorerLink } from "@/src/utils/explorer";
import { Tags } from "./tags";
import classNames from "classnames";
import type {
    CampaignDetails,
    TargetedNamedCampaign,
} from "@/src/types/campaign";

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
