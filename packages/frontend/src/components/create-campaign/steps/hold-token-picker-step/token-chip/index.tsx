import { RemoteLogo } from "@/src/components/remote-logo";
import { Typography } from "@metrom-xyz/ui";
import type { Address } from "viem";
import { XIcon } from "@/src/assets/x-icon";
import classNames from "classnames";

import styles from "./styles.module.css";

interface TokenChipProps {
    chainId: number;
    address: string;
    name: string;
    symbol: string;
    onRemove: () => void;
}

export function TokenChip({
    chainId,
    address,
    name,
    symbol,
    onRemove,
}: TokenChipProps) {
    return (
        <div className={styles.root}>
            <div className={styles.content}>
                <div className={styles.token}>
                    <RemoteLogo address={address as Address} chain={chainId} />
                    <Typography weight="medium" size="lg">
                        {symbol}
                    </Typography>
                    <Typography weight="medium" size="lg">
                        {name}
                    </Typography>
                </div>
                <XIcon onClick={onRemove} className={styles.icon} />
            </div>
        </div>
    );
}

export function TokenChipLoading() {
    return <div className={classNames(styles.root, styles.loading)}></div>;
}
