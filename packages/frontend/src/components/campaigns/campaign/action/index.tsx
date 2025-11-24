import {
    Skeleton,
    Typography,
    type RemoteLogoSize,
    type TypographySize,
} from "@metrom-xyz/ui";
import { PoolRemoteLogo } from "@/src/components/pool-remote-logo";
import classNames from "classnames";
import {
    DistributablesType,
    RestrictionType,
    TargetType,
} from "@metrom-xyz/sdk";
import { AmmPoolLiquidity } from "./amm-pool-liquidity";
import type { Campaign } from "@/src/types/campaign";
import { LiquityV2 } from "./liquity-v2";
import { AaveV3 } from "./aave-v3";
import { Empty } from "./empty";
import { HoldFungibleAsset } from "./hold-fungible-asset";
import { GmxV1Liquidity } from "./gmx-v1-liquidity";
import { TurtleVault } from "./turtle-vault";
import { useTranslations } from "next-intl";
import { DynamicPointsBoostChip } from "@/src/components/dynamic-points-boost-chip";

import styles from "./styles.module.css";

export interface ActionSizes {
    nameSize?: TypographySize;
    feeSize?: TypographySize;
    logoSize?: RemoteLogoSize;
}

interface ActionProps extends ActionSizes {
    campaign: Campaign;
    hideChips?: boolean;
    className?: string;
}

export function Action({
    campaign,
    hideChips = false,
    className,
    ...sizes
}: ActionProps) {
    const t = useTranslations("allCampaigns");

    const ammPoolLiquidity =
        campaign.isTargeting(TargetType.AmmPoolLiquidity) ||
        campaign.isTargeting(TargetType.JumperWhitelistedAmmPoolLiquidity);

    const gmxV1Liquidity = campaign.isTargeting(TargetType.GmxV1Liquidity);

    const liquityV2 =
        campaign.isTargeting(TargetType.LiquityV2Debt) ||
        campaign.isTargeting(TargetType.LiquityV2StabilityPool);

    const aaveV3 =
        campaign.isTargeting(TargetType.AaveV3Borrow) ||
        campaign.isTargeting(TargetType.AaveV3Supply) ||
        campaign.isTargeting(TargetType.AaveV3NetSupply) ||
        campaign.isTargeting(TargetType.AaveV3BridgeAndSupply);

    const holdFungibleAsset = campaign.isTargeting(
        TargetType.HoldFungibleAsset,
    );

    const turtleVault = campaign.isTargeting(TargetType.Turtle);

    const empty = campaign.isTargeting(TargetType.Empty);

    const dynamicPoints = campaign.isDistributing(
        DistributablesType.DynamicPoints,
    );

    return (
        <div className={classNames(styles.root, className)}>
            {empty && <Empty campaign={campaign} {...sizes} />}
            {ammPoolLiquidity && (
                <AmmPoolLiquidity campaign={campaign} {...sizes} />
            )}
            {gmxV1Liquidity && (
                <GmxV1Liquidity campaign={campaign} {...sizes} />
            )}
            {liquityV2 && <LiquityV2 campaign={campaign} {...sizes} />}
            {aaveV3 && <AaveV3 campaign={campaign} {...sizes} />}
            {holdFungibleAsset && (
                <HoldFungibleAsset campaign={campaign} {...sizes} />
            )}
            {turtleVault && <TurtleVault campaign={campaign} {...sizes} />}
            {dynamicPoints && liquityV2 && (
                <DynamicPointsBoostChip
                    protocol={campaign.target.brand.slug}
                    boosting={campaign.distributables.boosting}
                />
            )}
            {!hideChips && (
                <div className={styles.chipsWrapper}>
                    {campaign.specification?.kpi && (
                        <div className={styles.chip}>
                            <Typography size="xs" weight="medium" uppercase>
                                {t("kpi")}
                            </Typography>
                        </div>
                    )}
                    {campaign.specification?.priceRange && (
                        <div className={styles.chip}>
                            <Typography size="xs" weight="medium" uppercase>
                                {t("pool.range")}
                            </Typography>
                        </div>
                    )}
                    {campaign.restrictions?.type ===
                        RestrictionType.Whitelist && (
                        <div className={styles.chip}>
                            <Typography size="xs" weight="medium" uppercase>
                                {t("restricted")}
                            </Typography>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export function SkeletonAction() {
    return (
        <div className={classNames(styles.root, styles.loading)}>
            <PoolRemoteLogo
                tokens={[{ address: "0x1" }, { address: "0x2" }]}
                loading
            />
            <div className={classNames(styles.titleContainer, styles.loading)}>
                <Skeleton size="lg" width={300} />
                <Skeleton size="sm" width={50} className={styles.campaignFee} />
            </div>
        </div>
    );
}
