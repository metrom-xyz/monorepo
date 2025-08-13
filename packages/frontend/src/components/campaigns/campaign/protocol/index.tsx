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
        crossVm: true,
    });

    const [popoverOpen, setPopoverOpen] = useState(false);
    const [dexDetails, setDexDetails] = useState<HTMLDivElement | null>(null);
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
                <Popover
                    open={popoverOpen}
                    anchor={dexDetails}
                    ref={dexDetailsPopoverRef}
                    placement="top"
                >
                    <div className={styles.detailsContainer}>
                        <Typography weight="medium" size="sm">
                            {protocol?.name}
                        </Typography>
                    </div>
                </Popover>
                <div
                    ref={setDexDetails}
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
