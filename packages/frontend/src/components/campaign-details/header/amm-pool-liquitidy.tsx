import { Typography, Button, InfoTooltip } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { getExplorerLink } from "@/src/utils/explorer";
import { formatPercentage } from "@/src/utils/format";
import { trackFathomEvent } from "@/src/utils/fathom";
import { PoolRemoteLogo } from "../../pool-remote-logo";
import { type AmmPoolLiquidityTargetType } from "@metrom-xyz/sdk";
import type { TargetedNamedCampaign } from "@/src/types/campaign";
import { useVelodromePoolTickSpacing } from "@/src/hooks/useVelodromePoolTickSpacing";
import { Tags } from "./tags";
import classNames from "classnames";

import styles from "./styles.module.css";

interface AmmPoolLiquityHeaderProps {
    campaign: TargetedNamedCampaign<AmmPoolLiquidityTargetType>;
}

export function AmmPoolLiquityHeader({ campaign }: AmmPoolLiquityHeaderProps) {
    const t = useTranslations("campaignDetails.header");
    const { tickSpacing, loading: loadingTickSpacing } =
        useVelodromePoolTickSpacing({
            pool: campaign.target.pool,
            enabled: campaign.target.pool.amm === "velodrome",
        });

    const velodromePoolParams =
        campaign.target.pool.amm === "velodrome" && tickSpacing !== undefined
            ? {
                  type: tickSpacing,
              }
            : undefined;

    const ChainIcon = campaign.chainData?.icon;
    const depositLink = campaign.getDepositLiquidityUrl(velodromePoolParams);
    const explorerLink = getExplorerLink(
        campaign.target.pool.id,
        campaign.target.chainId,
        campaign.target.chainType,
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
                            <Typography size="sm">
                                {campaign.chainData.name}
                            </Typography>
                        </InfoTooltip>
                    )}
                    <PoolRemoteLogo
                        chain={campaign.chainId}
                        size="lg"
                        tokens={campaign.target.pool.tokens.map((token) => ({
                            address: token.address,
                            defaultText: token.symbol,
                        }))}
                    />
                    <Typography size="xl3" weight="medium">
                        {campaign.name}
                    </Typography>
                    {campaign.target.pool.fee && (
                        <Typography
                            size="lg"
                            weight="medium"
                            variant="tertiary"
                        >
                            {formatPercentage({
                                percentage: campaign.target.pool.fee,
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
                <Tags campaign={campaign} />
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
