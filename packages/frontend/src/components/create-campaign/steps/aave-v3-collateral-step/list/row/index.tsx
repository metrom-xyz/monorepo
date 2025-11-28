import { type AaveV3Collateral, CampaignKind } from "@metrom-xyz/sdk";
import { RemoteLogo } from "@/src/components/remote-logo";
import { Skeleton, Typography } from "@metrom-xyz/ui";
import { useCallback } from "react";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import classNames from "classnames";
import { formatUsdAmount } from "@/src/utils/format";
import { getAaveV3UsdTarget } from "@/src/utils/aave-v3";

import styles from "./styles.module.css";

interface RowProps {
    kind?: CampaignKind;
    selected?: boolean;
    collateral: AaveV3Collateral;
    onChange: (collateral: AaveV3Collateral) => void;
}

export function Row({ kind, selected, collateral, onChange }: RowProps) {
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
                <RemoteLogo chain={chainId} address={collateral.address} />
                <Typography weight="medium" size="lg">
                    {collateral.symbol}
                </Typography>
            </div>
            <Typography weight="medium" size="sm" variant="tertiary">
                {formatUsdAmount({
                    amount: getAaveV3UsdTarget({ collateral, kind }),
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
