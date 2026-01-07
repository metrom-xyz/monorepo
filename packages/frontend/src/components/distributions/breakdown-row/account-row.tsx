import { type Address } from "viem";
import { getColorFromAddress, isZeroAddress } from "@/src/utils/address";
import { Skeleton, Theme, Typography } from "@metrom-xyz/ui";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import {
    formatAmount,
    formatAmountChange,
    formatPercentage,
} from "@/src/utils/format";
import type { OnChainAmount } from "@metrom-xyz/sdk";
import { useTheme } from "next-themes";

import styles from "./styles.module.css";

interface AccountRowProps {
    rank: number;
    account: Address;
    connected: boolean;
    amount: OnChainAmount;
    amountChange: OnChainAmount;
    percentage: OnChainAmount;
}

export function AccountRow({
    rank,
    account,
    connected,
    amount,
    amountChange,
    percentage,
}: AccountRowProps) {
    const t = useTranslations("campaignDistributions");
    const { resolvedTheme } = useTheme();

    return (
        <div className={styles.accountRow}>
            <Typography variant="tertiary" weight="medium">
                #{rank + 1}
            </Typography>
            <Typography>
                {formatPercentage({
                    percentage: percentage.formatted,
                })}
            </Typography>
            <div className={styles.account}>
                <div
                    className={styles.legend}
                    style={{
                        backgroundColor: getColorFromAddress(
                            account as Address,
                            resolvedTheme as Theme,
                        ),
                    }}
                ></div>
                <Typography
                    size="sm"
                    variant="tertiary"
                    weight="medium"
                    className={classNames({
                        [styles.connected]: connected,
                    })}
                >
                    {isZeroAddress(account) ? t("reimbursed") : account}
                </Typography>
            </div>
            <div className={styles.amount}>
                <Typography>
                    {formatAmount({
                        amount: amount.formatted,
                    })}
                </Typography>
                <Typography
                    size="xs"
                    className={classNames(styles.change, {
                        [styles.positive]: amountChange.formatted > 0,
                        [styles.negative]: amountChange.formatted < 0,
                    })}
                >
                    {formatAmountChange({
                        amount: amountChange.formatted,
                    })}
                </Typography>
            </div>
        </div>
    );
}

export function AccountRowSkeleton() {
    return (
        <div className={styles.accountRow}>
            <div className={styles.account}>
                <Skeleton width={380} size="sm" />
            </div>
            <div className={classNames(styles.amount, styles.loading)}>
                <Skeleton width={100} size="sm" />
                <Skeleton width={25} size="xs" />
            </div>
            <Skeleton width={100} size="sm" />
        </div>
    );
}
