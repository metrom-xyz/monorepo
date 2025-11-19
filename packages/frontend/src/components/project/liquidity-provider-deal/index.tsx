import { SupportedLiquidityProviderDeal } from "@metrom-xyz/sdk";
import { TurtleClub } from "./turtle-club";

import styles from "./styles.module.css";

interface LiquidityProviderDealProps {
    protocol: SupportedLiquidityProviderDeal;
    campaignId?: string;
}

export function LiquidityProviderDeal({
    protocol,
    campaignId,
}: LiquidityProviderDealProps) {
    return (
        <div className={styles.root}>
            {protocol === SupportedLiquidityProviderDeal.TurtleClub && (
                <TurtleClub campaignId={campaignId} />
            )}
        </div>
    );
}
