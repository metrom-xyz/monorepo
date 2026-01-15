import {
    formatAmount,
    formatDateTime,
    formatPercentage,
    formatUsdAmount,
} from "@/src/utils/format";
import { useTranslations } from "next-intl";
import { Typography } from "@metrom-xyz/ui";
import type { DistributionChartData } from "..";
import type { SupportedChain } from "@metrom-xyz/contracts";
import dayjs from "dayjs";
import { type Address } from "viem";
import { RemoteLogo } from "../../remote-logo";
import {
    getColorFromAddress,
    isZeroAddress,
    shortenAddress,
} from "@/src/utils/address";

import styles from "./styles.module.css";

interface Payload {
    name: string;
    payload: DistributionChartData;
}

interface TooltipProps {
    chain?: SupportedChain;
    active?: boolean;
    payload?: Payload[];
}

export function TooltipContent({ chain, active, payload }: TooltipProps) {
    const t = useTranslations("campaignDistributions");

    if (!active || !payload || !payload.length) return null;

    const { timestamp, weights, tokens } = payload[0].payload;

    const account = payload[0].name.split(".")[1] as Address;
    const tokenAddress = payload[0].name.split(".")[2] as Address;
    const token = tokens[tokenAddress];

    return (
        <div className={styles.root}>
            <div className={styles.fieldWrapper}>
                <Typography
                    size="sm"
                    weight="medium"
                    variant="tertiary"
                    uppercase
                >
                    {t("time")}
                </Typography>
                <Typography size="sm" weight="medium" uppercase>
                    {formatDateTime(dayjs.unix(timestamp))}
                </Typography>
            </div>
            <div className={styles.fieldWrapper}>
                <Typography
                    size="sm"
                    weight="medium"
                    variant="tertiary"
                    uppercase
                >
                    {t("account")}
                </Typography>
                <div className={styles.accountWrapper}>
                    <div
                        className={styles.legendSquare}
                        style={{
                            backgroundColor: getColorFromAddress(
                                account as Address,
                            ),
                        }}
                    ></div>
                    <Typography size="sm" weight="medium">
                        {isZeroAddress(account)
                            ? t("reimbursed")
                            : shortenAddress(account, true)}
                    </Typography>
                </div>
            </div>
            <div className={styles.fieldWrapper}>
                <Typography
                    size="sm"
                    weight="medium"
                    variant="tertiary"
                    uppercase
                >
                    {t("token")}
                </Typography>
                <div className={styles.tokenWrapper}>
                    <RemoteLogo
                        size="xs"
                        address={tokenAddress}
                        chain={chain}
                    />
                    <Typography size="sm" weight="medium">
                        {token.token.symbol}
                    </Typography>
                </div>
            </div>
            <div className={styles.fieldWrapper}>
                <Typography
                    size="sm"
                    weight="medium"
                    variant="tertiary"
                    uppercase
                >
                    {t("distributed")}
                </Typography>
                <div className={styles.amount}>
                    <Typography size="sm" weight="medium">
                        {formatAmount({
                            amount: weights[account][tokenAddress].amount
                                .formatted,
                        })}
                    </Typography>
                    <Typography size="sm" weight="medium" variant="tertiary">
                        {formatUsdAmount({
                            amount: weights[account][tokenAddress].usdAmount,
                        })}
                    </Typography>
                </div>
            </div>
            <div className={styles.fieldWrapper}>
                <Typography
                    size="sm"
                    weight="medium"
                    variant="tertiary"
                    uppercase
                >
                    {t("weight")}
                </Typography>
                <Typography size="sm" weight="medium">
                    {formatPercentage({
                        percentage:
                            weights[account][tokenAddress].percentage.formatted,
                    })}
                </Typography>
            </div>
        </div>
    );
}
