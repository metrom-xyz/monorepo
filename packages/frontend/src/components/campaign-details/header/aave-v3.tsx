import { Typography, Button, InfoTooltip } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { TargetType, type AaveV3TargetType } from "@metrom-xyz/sdk";
import { ProtocolType } from "@metrom-xyz/chains";
import { useProtocolsInChain } from "@/src/hooks/useProtocolsInChain";
import { RemoteLogo } from "../../remote-logo";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { Tags } from "./tags";
import type {
    CampaignDetails,
    TargetedNamedCampaign,
} from "@/src/types/campaign";

import styles from "./styles.module.css";

interface AaveV3HeaderProps {
    campaignDetails: TargetedNamedCampaign<AaveV3TargetType, CampaignDetails>;
}

export function AaveV3Header({ campaignDetails }: AaveV3HeaderProps) {
    const t = useTranslations("campaignDetails.header");
    const { chainId, chainType, target, chainData, name } = campaignDetails;

    const brand = useProtocolsInChain({
        chainId,
        chainType,
        type: ProtocolType.AaveV3,
        crossVm: true,
    }).find((brand) => brand.slug === target.brand.slug);

    const ChainIcon = chainData?.icon;
    const actionLink = brand?.actionUrls[target.type];
    const supplyActionLink = brand?.actionUrls[TargetType.AaveV3Supply];
    const bridgeActionLink = brand?.actionUrls[
        TargetType.AaveV3BridgeAndSupply
    ].replace("{collateral}", target.collateral.address);

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
                        address={target.collateral.address}
                        chain={target.chainId}
                    />
                    <Typography size="xl3" weight="medium">
                        {name}
                    </Typography>
                </div>
                <Tags campaignDetails={campaignDetails} />
            </div>
            <div className={styles.actions}>
                {target.type === TargetType.AaveV3BridgeAndSupply && (
                    <>
                        <Button
                            size="sm"
                            href={bridgeActionLink || undefined}
                            disabled={!bridgeActionLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            icon={ArrowRightIcon}
                            iconPlacement="right"
                            className={{
                                icon: styles.externalLinkIcon,
                            }}
                        >
                            {t("aaveV3.aave-v3-bridge", {
                                collateral: target.collateral.symbol,
                                bridge: target.bridge.name,
                            })}
                        </Button>
                        <Button
                            size="sm"
                            href={supplyActionLink || undefined}
                            disabled={!supplyActionLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            icon={ArrowRightIcon}
                            iconPlacement="right"
                            className={{
                                icon: styles.externalLinkIcon,
                            }}
                        >
                            {t("aaveV3.aave-v3-supply", {
                                collateral: target.collateral.symbol,
                                brand: target.brand.name,
                            })}
                        </Button>
                    </>
                )}
                {target.type !== TargetType.AaveV3BridgeAndSupply && (
                    <Button
                        size="sm"
                        href={actionLink || undefined}
                        disabled={!actionLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        icon={ArrowRightIcon}
                        iconPlacement="right"
                        className={{
                            icon: styles.externalLinkIcon,
                        }}
                    >
                        {t(`aaveV3.${target.type}`, {
                            collateral: target.collateral.symbol,
                            brand: target.brand.name,
                        })}
                    </Button>
                )}
            </div>
        </>
    );
}
