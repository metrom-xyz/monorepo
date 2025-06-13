import { Chip, Typography, type TypographySize } from "@metrom-xyz/ui";
import { useProtocolsInChain } from "@/src/hooks/useProtocolsInChain";
import type { Campaign } from "@/src/types/campaign";
import { TargetType } from "@metrom-xyz/sdk";

import styles from "./styles.module.css";
import classNames from "classnames";

interface ProtocolChipProps {
    campaign: Campaign;
    size?: TypographySize;
}

export function ProtocolChip({ campaign, size = "xs" }: ProtocolChipProps) {
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

    return (
        <Chip
            variant="secondary"
            border="squared"
            className={{ root: styles.root }}
        >
            {protocol?.logo && (
                <protocol.logo
                    className={classNames(styles.icon, {
                        [styles[size]]: true,
                    })}
                />
            )}
            <Typography size={size} uppercase>
                {protocol?.name}
            </Typography>
        </Chip>
    );
}
