import { SupportedLiquidityProviderDeal } from "@metrom-xyz/sdk";
import { Turtle } from "./turtle";

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
            {protocol === SupportedLiquidityProviderDeal.Turtle && (
                <Turtle campaignId={campaignId} />
            )}
        </div>
    );
}
