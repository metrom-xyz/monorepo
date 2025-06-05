import { type Address, zeroAddress } from "viem";
import { getColorFromAddress } from "@/src/utils/address";
import { Typography } from "@metrom-xyz/ui";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import {
    formatAmount,
    formatAmountChange,
    formatPercentage,
} from "@/src/utils/format";
import type { OnChainAmount } from "@metrom-xyz/sdk";

import styles from "./styles.module.css";

interface AccountRowProps {
    account: Address;
    connected: boolean;
    amount: OnChainAmount;
    amountChange: OnChainAmount;
    percentage: OnChainAmount;
}

export function AccountRow({
    account,
    connected,
    amount,
    amountChange,
    percentage,
}: AccountRowProps) {
    const t = useTranslations("campaignDistributions");

    return (
        <div className={styles.accountRow}>
            <div className={styles.account}>
                <div
                    className={styles.legend}
                    style={{
                        backgroundColor: getColorFromAddress(
                            account as Address,
                        ),
                    }}
                ></div>
                <Typography
                    size="sm"
                    light
                    weight="medium"
                    className={classNames({
                        [styles.connected]: connected,
                    })}
                >
                    {account === zeroAddress ? t("reimbursed") : account}
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
            <Typography>
                {formatPercentage({
                    percentage: percentage.formatted,
                })}
            </Typography>
        </div>
    );
}
