import { Popover, Skeleton, Typography } from "@metrom-xyz/ui";
import {
    SupportedErc4626Vault,
    SupportedLiquidityProviderDeal,
    TargetType,
} from "@metrom-xyz/sdk";
import type { Campaign } from "@/src/types/campaign/common";
import { useRef, useState } from "react";
import { useProtocolsInChain } from "@/src/hooks/useProtocolsInChain";
import { ProtocolLogo } from "@/src/components/protocol-logo";
import {
    ARCHE_ARUSD_VAULT_ADDRESSES,
    ARCHE_USD_TOKEN_ADDRESSES,
} from "@/src/commons";

import styles from "./styles.module.css";
import { getErc20Protocol } from "@/src/utils/erc20";
import type { Protocol } from "@metrom-xyz/chains";
import { FungibleAssetLogo } from "@/src/components/fungible-asset/fungible-asset-logo";

interface ProtocolProps {
    campaign: Campaign;
}

export function Protocol({ campaign }: ProtocolProps) {
    const protocols = useProtocolsInChain({
        chainId: campaign.chainId,
        chainType: campaign.chainType,
        crossVm: true,
    });

    const [popoverOpen, setPopoverOpen] = useState(false);
    const [details, setDetails] = useState<HTMLDivElement | null>(null);
    const dexDetailsPopoverRef = useRef<HTMLDivElement>(null);

    let protocol = protocols.find((protocol) => {
        switch (campaign.target.type) {
            case TargetType.AmmPoolLiquidity:
            case TargetType.JumperWhitelistedAmmPoolLiquidity: {
                return protocol.slug === campaign.target.pool.dex.slug;
            }
            case TargetType.GmxV1Liquidity:
            case TargetType.LiquityV2Debt:
            case TargetType.LiquityV2StabilityPool:
            case TargetType.AaveV3Borrow:
            case TargetType.AaveV3Supply:
            case TargetType.AaveV3NetSupply:
            case TargetType.AaveV3BridgeAndSupply:
            case TargetType.Erc4626Vault: {
                return protocol.slug === campaign.target.brand.slug;
            }
            case TargetType.Turtle: {
                return (
                    protocol.slug ===
                    (campaign.target
                        .type as unknown as SupportedLiquidityProviderDeal)
                );
            }
            case TargetType.YieldSeeker: {
                return protocol.slug === campaign.target.type;
            }
            case TargetType.Odyssey: {
                return protocol.slug === campaign.target.brand;
            }
            case TargetType.HoldFungibleAsset: {
                if (
                    ARCHE_USD_TOKEN_ADDRESSES.includes(
                        campaign.target.asset.address,
                    )
                )
                    return protocol.slug === SupportedErc4626Vault.Arche;

                return false;
            }
        }
    });

    function handleDexDetailsPopoverOpen() {
        setPopoverOpen(true);
    }

    function handleDexDetailsPopoverClose() {
        setPopoverOpen(false);
    }

    if (
        campaign.target.type === TargetType.Erc4626Vault &&
        ARCHE_ARUSD_VAULT_ADDRESSES.includes(campaign.target.vault.address)
    ) {
        protocol = protocols.find(
            (protocol) => protocol.slug === SupportedErc4626Vault.Arche,
        );
    }

    let fungibleAssetProtocol;
    if (!protocol && campaign.target.type === TargetType.HoldFungibleAsset)
        fungibleAssetProtocol = getErc20Protocol(campaign.target.asset);

    const protocolName = protocol?.name || fungibleAssetProtocol?.name;
    const holdFungibleAssetCampaign =
        campaign.target.type === TargetType.HoldFungibleAsset;

    return (
        <div className={styles.root}>
            {protocolName && (
                <Popover
                    ref={dexDetailsPopoverRef}
                    open={popoverOpen}
                    anchor={details}
                    onOpenChange={setPopoverOpen}
                    placement="bottom"
                >
                    <Typography weight="medium" size="sm">
                        {protocolName}
                    </Typography>
                </Popover>
            )}
            <div
                ref={setDetails}
                onMouseEnter={handleDexDetailsPopoverOpen}
                onMouseLeave={handleDexDetailsPopoverClose}
            >
                {fungibleAssetProtocol && holdFungibleAssetCampaign ? (
                    <FungibleAssetLogo
                        size="sm"
                        chainId={campaign.chainId}
                        asset={campaign.target.asset}
                        forceProtocol
                    />
                ) : (
                    <ProtocolLogo protocol={protocol} size="sm" />
                )}
            </div>
        </div>
    );
}

export function SkeletonProtocol() {
    return (
        <div className={styles.root}>
            <Skeleton circular className={styles.icon} />
        </div>
    );
}
