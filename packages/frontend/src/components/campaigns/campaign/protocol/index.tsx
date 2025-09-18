import { Popover, Skeleton, Typography } from "@metrom-xyz/ui";
import { TargetType } from "@metrom-xyz/sdk";
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
            case TargetType.AmmPoolLiquidity: {
                return protocol.slug === campaign.target.pool.dex.slug;
            }
            case TargetType.LiquityV2Debt:
            case TargetType.LiquityV2StabilityPool: {
                return protocol.slug === campaign.target.brand.slug;
            }
            case TargetType.AaveV3Borrow:
            case TargetType.AaveV3Supply:
            case TargetType.AaveV3NetSupply:
            case TargetType.AaveV3BridgeAndSupply: {
                return protocol.slug === campaign.target.brand.slug;
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
            <div className={styles.root}>
                {protocol && (
                    <Popover
                        open={popoverOpen}
                        anchor={details}
                        ref={dexDetailsPopoverRef}
                        placement="top"
                    >
                        <div className={styles.detailsContainer}>
                            <Typography weight="medium" size="sm">
                                {protocol.name}
                            </Typography>
                        </div>
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
