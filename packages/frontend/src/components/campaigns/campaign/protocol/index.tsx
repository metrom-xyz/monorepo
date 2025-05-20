import { Skeleton, Typography } from "@metrom-xyz/ui";
import { TargetType } from "@metrom-xyz/sdk";
import type { Campaign } from "@/src/types/campaign";
import { useProtocolsInChain } from "@/src/hooks/useProtocolsInChain";
import classNames from "classnames";

import styles from "./styles.module.css";
import commonStyles from "../styles.module.css";

interface ProtocolProps {
    campaign: Campaign;
}

export function Protocol({ campaign }: ProtocolProps) {
    const protocols = useProtocolsInChain({ chainId: campaign.chainId });

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

    return (
        <div className={classNames(styles.root, commonStyles.chip)}>
            {Logo ? <Logo className={styles.icon} /> : "-"}
            <Typography size="sm" uppercase weight="medium" light>
                {protocol?.name}
            </Typography>
        </div>
    );
}

export function SkeletonProtocol() {
    return <Skeleton width={80} size="xl" />;
}
