import type { AaveV3Collateral } from "@metrom-xyz/sdk";
import { RemoteLogo } from "@/src/components/remote-logo";
import { Skeleton, Typography } from "@metrom-xyz/ui";
import { useCallback } from "react";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import classNames from "classnames";
import { formatUsdAmount } from "@/src/utils/format";
import { CampaignKind } from "@/src/types/campaign";

import styles from "./styles.module.css";

interface RowProps {
    action?: CampaignKind;
    selected?: boolean;
    collateral: AaveV3Collateral;
    onChange: (collateral: AaveV3Collateral) => void;
}

export function Row({ action, selected, collateral, onChange }: RowProps) {
    const { id: chainId } = useChainWithType();

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
                        action === CampaignKind.AaveV3Borrow
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
