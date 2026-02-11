import { Popover, Skeleton, Typography } from "@metrom-xyz/ui";
import { SupportedLiquidityProviderDeal, TargetType } from "@metrom-xyz/sdk";
import type { Campaign } from "@/src/types/campaign";
import { useRef, useState } from "react";
import { useProtocolsInChain } from "@/src/hooks/useProtocolsInChain";
import { ProtocolLogo } from "@/src/components/protocol-logo";

import styles from "./styles.module.css";

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

    const protocol = protocols.find((protocol) => {
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
            case TargetType.AaveV3BridgeAndSupply: {
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
        }
    });

    function handleDexDetailsPopoverOpen() {
        setPopoverOpen(true);
    }

    function handleDexDetailsPopoverClose() {
        setPopoverOpen(false);
    }

    return (
        <div className={styles.root}>
            <div>
                {protocol && (
                    <Popover
                        ref={dexDetailsPopoverRef}
                        open={popoverOpen}
                        anchor={details}
                        onOpenChange={setPopoverOpen}
                        placement="bottom"
                    >
                        <Typography weight="medium" size="sm">
                            {protocol.name}
                        </Typography>
                    </Popover>
                )}
                <div
                    ref={setDetails}
                    onMouseEnter={handleDexDetailsPopoverOpen}
                    onMouseLeave={handleDexDetailsPopoverClose}
                >
                    <ProtocolLogo protocol={protocol} size="sm" />
                </div>
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
