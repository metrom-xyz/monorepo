import type { LiquityV2Collateral } from "@metrom-xyz/sdk";
import { RemoteLogo } from "@/src/components/remote-logo";
import { Skeleton, Typography } from "@metrom-xyz/ui";
import { useCallback } from "react";
import { useChainId } from "wagmi";
import classNames from "classnames";

import styles from "./styles.module.css";

interface RowProps {
    selected?: boolean;
    collateral: LiquityV2Collateral;
    onAdd: (collateral: LiquityV2Collateral) => void;
    onRemove: (collateral: LiquityV2Collateral) => void;
}

export function Row({ selected, collateral, onAdd, onRemove }: RowProps) {
    const chainId = useChainId();

    const handleOnClick = useCallback(() => {
        if (!collateral) return;
        if (selected) onRemove(collateral);
        else onAdd(collateral);
    }, [collateral, selected, onRemove, onAdd]);

    return (
        <div
            onClick={handleOnClick}
            className={classNames(styles.root, { [styles.selected]: selected })}
        >
            <input type="checkbox" checked={selected} />
            <div className={styles.collateralName}>
                <RemoteLogo
                    chain={chainId}
                    address={collateral.token.address}
                />
                <Typography weight="medium" size="lg">
                    {collateral.token.symbol}
                </Typography>
            </div>
        </div>
    );
}

export function RowSkeleton() {
    return (
        <div className={classNames(styles.root)}>
            <div className={styles.collateralName}>
                <Skeleton circular width={32} />
                <Skeleton size="lg" width={40} />
            </div>
        </div>
    );
}
