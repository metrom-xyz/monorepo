import {
    formatAmount,
    formatDateTime,
    formatPercentage,
} from "@/src/utils/format";
import { useTranslations } from "next-intl";
import { Typography } from "@metrom-xyz/ui";
import type { DistributionChartData } from "..";
import type { SupportedChain } from "@metrom-xyz/contracts";
import dayjs from "dayjs";
import { type Address, zeroAddress } from "viem";
import { RemoteLogo } from "../../remote-logo";
import { getColorFromAddress } from "@/src/utils/address";

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

    const { timestamp, weights } = payload[0].payload;

    const token = payload[0].name.split(".")[1] as Address;
    const account = payload[0].name.split(".")[2] as Address;

    return (
        <div className={styles.root}>
            <div className={styles.fieldWrapper}>
                <Typography weight="medium" variant="tertiary"uppercase>
                    {t("time")}
                </Typography>
                <Typography weight="medium" uppercase>
                    {formatDateTime(dayjs.unix(timestamp))}
                </Typography>
            </div>
            <div className={styles.fieldWrapper}>
                <Typography weight="medium" variant="tertiary"uppercase>
                    {t("token")}
                </Typography>
                <RemoteLogo address={token} chain={chain} />
            </div>
            <div className={styles.fieldWrapper}>
                <Typography weight="medium" variant="tertiary"uppercase>
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
                        {account === zeroAddress ? t("reimbursed") : account}
                    </Typography>
                </div>
            </div>
            <div className={styles.fieldWrapper}>
                <Typography weight="medium" variant="tertiary"uppercase>
                    {t("distributed")}
                </Typography>
                <Typography size="sm" weight="medium">
                    {formatAmount({
                        amount: weights[token][account].amount.formatted,
                    })}
                </Typography>
            </div>
            <div className={styles.fieldWrapper}>
                <Typography weight="medium" variant="tertiary"uppercase>
                    {t("weight")}
                </Typography>
                <Typography size="sm" weight="medium">
                    {formatPercentage({
                        percentage:
                            weights[token][account].percentage.formatted,
                    })}
                </Typography>
            </div>
        </div>
    );
}
