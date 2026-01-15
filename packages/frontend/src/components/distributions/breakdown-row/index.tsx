import { type Address } from "viem";
import { AccountRow, AccountRowSkeleton } from "./account-row";
import type { RowComponentProps } from "react-window";
import type { ActiveDistributionWeights } from "..";
import type { ChainType } from "@metrom-xyz/sdk";
import classNames from "classnames";

import styles from "./styles.module.css";

interface BreakdownRowProps {
    chainId: number;
    chainType: ChainType;
    activeAccount?: string;
    activeDistroWeights: ActiveDistributionWeights[];
}

export function BreakdownRow({
    style,
    index,
    chainId,
    chainType,
    activeAccount,
    activeDistroWeights,
}: RowComponentProps<BreakdownRowProps>) {
    const distro = activeDistroWeights[index];
    const active =
        activeAccount?.toLowerCase() === distro.account.toLowerCase();

    return (
        <div
            style={style}
            className={classNames(styles.root, {
                [styles.active]: active,
            })}
        >
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
            />
        </div>
    );
}

export function BreakdownRowSkeleton() {
    return (
        <div className={styles.root}>
            <AccountRowSkeleton />
        </div>
    );
}
