import { Popover, Skeleton, Typography } from "@metrom-xyz/ui";
import { TargetType } from "@metrom-xyz/sdk";
import type { NamedCampaign } from "@/src/types";
import { useProtocolsInChain } from "@/src/hooks/useProtocolsInChain";
import { useRef, useState } from "react";

import styles from "./styles.module.css";

interface ProtocolProps {
    campaign: NamedCampaign;
}

export function Protocol({ campaign }: ProtocolProps) {
    const protocols = useProtocolsInChain(campaign.chainId);

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
    const Logo = protocol?.logo;

    function handleDexDetailsPopoverOpen() {
        setPopoverOpen(true);
    }

    function handleDexDetailsPopoverClose() {
        setPopoverOpen(false);
    }

    return (
        <div className={styles.root}>
            {Logo ? (
                <div className={styles.root}>
                    <Popover
                        open={popoverOpen}
                        anchor={dexDetails}
                        ref={dexDetailsPopoverRef}
                        placement="top"
                    >
                        <div className={styles.detailsContainer}>
                            <Typography weight="medium" size="sm">
                                {protocol.name}
                            </Typography>
                        </div>
                    </Popover>
                    <div
                        ref={setDexDetails}
                        onMouseEnter={handleDexDetailsPopoverOpen}
                        onMouseLeave={handleDexDetailsPopoverClose}
                    >
                        <Logo className={styles.icon} />
                    </div>
                </div>
            ) : (
                "-"
            )}
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
