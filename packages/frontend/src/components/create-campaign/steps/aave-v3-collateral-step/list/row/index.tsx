import type { AaveV3Collateral } from "@metrom-xyz/sdk";
import { RemoteLogo } from "@/src/components/remote-logo";
import { Skeleton, Typography } from "@metrom-xyz/ui";
import { useCallback } from "react";
import { useChainId } from "@/src/hooks/use-chain-id";
import classNames from "classnames";
import { AaveV3Action, LiquityV2Action } from "@/src/types/common";
import type { AaveV3CampaignPayload } from "@/src/types/campaign";
import { formatUsdAmount } from "@/src/utils/format";

import styles from "./styles.module.css";

interface RowProps {
    action?: AaveV3CampaignPayload["action"];
    selected?: boolean;
    collateral: AaveV3Collateral;
    onChange: (collateral: AaveV3Collateral) => void;
}

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
                {formatUsdAmount({
                    amount:
                        action === AaveV3Action.Borrow
                            ? collateral.usdDebt
                            : collateral.usdSupply,
                })}
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
