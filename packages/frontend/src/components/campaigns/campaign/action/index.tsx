import {
    Skeleton,
    Typography,
    type RemoteLogoSize,
    type TypographySize,
} from "@metrom-xyz/ui";
import { PoolRemoteLogo } from "@/src/components/pool-remote-logo";
import classNames from "classnames";
import { RestrictionType, TargetType } from "@metrom-xyz/sdk";
import { AmmPoolLiquidity } from "./amm-pool-liquidity";
import type { Campaign } from "@/src/types/campaign";
import { LiquityV2 } from "./liquity-v2";
import { AaveV3 } from "./aave-v3";
import { Empty } from "./empty";
import { HoldFungibleAsset } from "./hold-fungible-asset";
import { GmxV1Liquidity } from "./gmx-v1-liquidity";
import { KatanaVault } from "./katana-vault";
import { useTranslations } from "next-intl";

import styles from "./styles.module.css";

export interface ActionSizes {
    nameSize?: TypographySize;
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

    const katanaVault = campaign.isTargeting(TargetType.KatanaVault);

    const empty = campaign.isTargeting(TargetType.Empty);

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
            {katanaVault && <KatanaVault campaign={campaign} {...sizes} />}
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
