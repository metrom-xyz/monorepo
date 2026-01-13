import { RemoteLogo } from "../../remote-logo";
import { type Address } from "viem";
import { Skeleton } from "@metrom-xyz/ui";
import classNames from "classnames";
import { useAccount } from "@/src/hooks/useAccount";
import { AccountRow, AccountRowSkeleton } from "./account-row";
import type { RowComponentProps } from "react-window";
import type { ActiveDistributionWeights } from "..";
import type { ChainType } from "@metrom-xyz/sdk";

import styles from "./styles.module.css";

interface BreakdownRowProps {
    chainId: number;
    chainType: ChainType;
    activeDistroWeights: ActiveDistributionWeights[];
}

export function BreakdownRow({
    style,
    index,
    chainId,
    chainType,
    activeDistroWeights,
}: RowComponentProps<BreakdownRowProps>) {
    const { address } = useAccount();

    const distro = activeDistroWeights[index];

    return (
        <div style={style} className={styles.root}>
            <AccountRow
                rank={distro.rank}
                chainId={chainId}
                chainType={chainType}
                account={distro.account as Address}
                totalUsdAmount={distro.usdSummary.totalAmount}
                usdAmount={distro.usdSummary.amount}
                usdAmountChange={distro.usdSummary.amountChange}
                percentage={distro.usdSummary.percentage}
                weights={distro.weights}
                tokens={distro.tokens}
                tokensSummary={distro.tokensSummary}
                connected={
                    address?.toLowerCase() === distro.account.toLowerCase()
                }
            />
        </div>
    );
}

export function BreakdownRowSkeleton() {
    return (
        <div className={styles.root}>
            <div className={styles.tokenColumn}>
                <div className={classNames(styles.title, styles.loading)}>
                    <RemoteLogo loading />
                    <Skeleton width={150} size="lg" />
                </div>
                <div className={styles.header}>
                    <Skeleton width={100} size="sm" />
                    <Skeleton width={100} size="sm" />
                    <Skeleton width={100} size="sm" />
                </div>
                <div className={styles.accounts}>
                    {Array.from({ length: 17 }).map((_, index) => (
                        <AccountRowSkeleton key={index} />
                    ))}
                </div>
            </div>
        </div>
    );
}
