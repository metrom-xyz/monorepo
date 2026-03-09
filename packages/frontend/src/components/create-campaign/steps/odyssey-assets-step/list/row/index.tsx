import { type OdysseyAsset } from "@metrom-xyz/sdk";
import { RemoteLogo } from "@/src/components/remote-logo";
import { Skeleton, Typography } from "@metrom-xyz/ui";
import { useCallback } from "react";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import classNames from "classnames";
import { formatUsdAmount } from "@/src/utils/format";
import type { OdysseyStrategyData } from "@/src/commons/odyssey";
import { getOdysseyUsdTarget } from "@/src/utils/odyssey";

import styles from "./styles.module.css";

interface RowProps {
    strategy?: OdysseyStrategyData;
    selected?: boolean;
    asset: OdysseyAsset;
    onChange: (asset: OdysseyAsset) => void;
}

export function Row({ strategy, selected, asset, onChange }: RowProps) {
    const { id: chainId } = useChainWithType();

    const handleOnClick = useCallback(() => {
        onChange(asset);
    }, [asset, onChange]);

    return (
        <div
            className={classNames(styles.root, { [styles.active]: selected })}
            onClick={handleOnClick}
        >
            <div className={styles.collateral}>
                <RemoteLogo chain={chainId} address={asset.address} />
                <Typography weight="medium" size="lg">
                    {asset.symbol}
                </Typography>
            </div>
            <Typography weight="medium" size="sm" variant="tertiary">
                {formatUsdAmount({
                    amount: getOdysseyUsdTarget({
                        strategy: strategy?.id,
                        asset,
                    }),
                })}
            </Typography>
        </div>
    );
}

export function RowSkeleton() {
    return (
        <div className={styles.root}>
            <div className={styles.collateral}>
                <Skeleton circular width={32} />
                <Skeleton size="lg" width={40} />
            </div>
            <Skeleton size="sm" width={40} />
        </div>
    );
}
