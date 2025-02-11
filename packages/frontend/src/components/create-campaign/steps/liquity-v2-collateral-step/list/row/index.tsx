import type { LiquityV2Collateral } from "@metrom-xyz/sdk";
import { RemoteLogo } from "@/src/components/remote-logo";
import { Skeleton, Typography } from "@metrom-xyz/ui";
import { useCallback } from "react";
import { useChainId } from "wagmi";
import classNames from "classnames";
import { LiquityV2Action, type LiquityV2CampaignPayload } from "@/src/types";
import { formatUsdAmount } from "@/src/utils/format";

import styles from "./styles.module.css";

interface RowProps {
    action?: LiquityV2CampaignPayload["action"];
    selected?: boolean;
    collateral: LiquityV2Collateral;
    onChange: (collateral: LiquityV2Collateral) => void;
}

// TODO: add some sort of TVL indicator
export function Row({ action, selected, collateral, onChange }: RowProps) {
    const chainId = useChainId();

    const handleOnClick = useCallback(() => {
        onChange(collateral);
    }, [collateral, onChange]);

    return (
        <div
            className={classNames(styles.root, { [styles.active]: selected })}
            onClick={handleOnClick}
        >
            <div className={styles.collateral}>
                <RemoteLogo
                    chain={chainId}
                    address={collateral.token.address}
                />
                <Typography weight="medium" size="lg">
                    {collateral.token.symbol}
                </Typography>
            </div>
            <Typography weight="medium" size="sm" light>
                {formatUsdAmount(
                    action === LiquityV2Action.Debt
                        ? collateral.usdMintedDebt
                        : collateral.usdStabilityPoolDebt,
                )}
            </Typography>
        </div>
    );
}

export function RowSkeleton() {
    return (
        <div className={classNames(styles.root)}>
            <div className={styles.collateral}>
                <Skeleton circular width={32} />
                <Skeleton size="lg" width={40} />
            </div>
            <Skeleton size="sm" width={40} />
        </div>
    );
}
