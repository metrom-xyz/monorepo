import { RemoteLogo } from "@/src/components/remote-logo";
import { Typography } from "@metrom-xyz/ui";
import type { Address } from "viem";
import { XIcon } from "@/src/assets/x-icon";
import classNames from "classnames";

import styles from "./styles.module.css";

interface AssetChipProps {
    chainId: number;
    address: string;
    name: string;
    symbol: string;
    onRemove: () => void;
}

export function AssetChip({
    chainId,
    address,
    name,
    symbol,
    onRemove,
}: AssetChipProps) {
    return (
        <div className={styles.root}>
            <div className={styles.content}>
                <div className={styles.asset}>
                    <RemoteLogo address={address as Address} chain={chainId} />
                    <Typography weight="medium" size="lg">
                        {symbol}
                    </Typography>
                    <Typography
                        weight="medium"
                        light
                        truncate
                        className={styles.assetName}
                    >
                        {name}
                    </Typography>
                </div>
                <XIcon onClick={onRemove} className={styles.icon} />
            </div>
        </div>
    );
}

export function AssetChipLoading() {
    return <div className={classNames(styles.root, styles.loading)}></div>;
}
