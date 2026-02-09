import { Typography, Button, InfoTooltip } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { getExplorerLink } from "@/src/utils/explorer";
import { formatPercentage } from "@/src/utils/format";
import { trackFathomEvent } from "@/src/utils/fathom";
import { PoolRemoteLogo } from "../../pool-remote-logo";
import { type AmmPoolLiquidityTargetType } from "@metrom-xyz/sdk";
import type {
    TargetedNamedCampaign,
    CampaignDetails,
} from "@/src/types/campaign/common";
import { useVelodromePoolTickSpacing } from "@/src/hooks/useVelodromePoolTickSpacing";
import { Tags } from "./tags";
import classNames from "classnames";

import styles from "./styles.module.css";

interface AmmPoolLiquityHeaderProps {
    campaignDetails: TargetedNamedCampaign<
        AmmPoolLiquidityTargetType,
        CampaignDetails
    >;
}

export function AmmPoolLiquityHeader({
    campaignDetails,
}: AmmPoolLiquityHeaderProps) {
    const t = useTranslations("campaignDetails.header");
    const { chainId, name, target, chainData } = campaignDetails;

    const { tickSpacing, loading: loadingTickSpacing } =
        useVelodromePoolTickSpacing({
            pool: target.pool,
            enabled: target.pool.amm === "velodrome",
        });

    const velodromePoolParams =
        target.pool.amm === "velodrome" && tickSpacing !== undefined
            ? {
                  type: tickSpacing,
              }
            : undefined;

    const ChainIcon = chainData?.icon;
    const depositLink =
        campaignDetails.getDepositLiquidityUrl(velodromePoolParams);
    const explorerLink = getExplorerLink(
        target.pool.id,
        target.chainId,
        target.chainType,
    );

    function handleAddLiquidityOnClick() {
        trackFathomEvent("CLICK_POOL_DEPOSIT");
    }

    function handleExploreOnClick() {
        trackFathomEvent("CLICK_DEX_EXPLORE");
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
                    <PoolRemoteLogo
                        chain={chainId}
                        size="lg"
                        tokens={target.pool.tokens.map((token) => ({
                            address: token.address,
                            defaultText: token.symbol,
                        }))}
                    />
                    <Typography size="xl3" weight="medium">
                        {name}
                    </Typography>
                    {target.pool.fee && (
                        <Typography
                            size="xl3"
                            weight="medium"
                            variant="tertiary"
                        >
                            {formatPercentage({
                                percentage: target.pool.fee,
                                keepDust: true,
                            })}
                        </Typography>
                    )}
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
            <div className={styles.actions}>
                <Button
                    size="sm"
                    href={
                        !!depositLink && !loadingTickSpacing
                            ? depositLink
                            : undefined
                    }
                    disabled={!depositLink || loadingTickSpacing}
                    loading={loadingTickSpacing}
                    onClick={handleAddLiquidityOnClick}
                    icon={ArrowRightIcon}
                    iconPlacement="right"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={{
                        icon: styles.externalLinkIcon,
                    }}
                >
                    {t("ammPoolLiquidity.deposit")}
                </Button>
            </div>
        </>
    );
}
