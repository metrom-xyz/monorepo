import classNames from "classnames";
import { Typography, Skeleton, Card } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { formatUsdAmount } from "@/src/utils/format";
import type { ChainData } from "@metrom-xyz/chains";

import styles from "./styles.module.css";

export interface ChainOption {
    chainId: number;
    data: ChainData;
    totalUsdValue: number;
}

interface ChainsProps {
    className?: string;
    options: ChainOption[];
    value: number | null;
    onChange: (chainId: number) => void;
}

export function Chains({ className, options, value, onChange }: ChainsProps) {
    const t = useTranslations("rewards.claims");

    return (
        <Card className={classNames(styles.root, className)}>
            <Typography light weight="medium" className={styles.header}>
                {t("chain")}
            </Typography>
            <div className={styles.chainsWrapper}>
                {options.map((option) => {
                    const ChainIcon = option.data.icon;

                    return (
                        <div
                            key={option.chainId}
                            onClick={() => onChange(option.chainId)}
                            className={classNames(
                                styles.row,
                                styles.rowAnimated,
                                {
                                    [styles.rowActive]:
                                        option.chainId === value,
                                },
                            )}
                        >
                            <div className={styles.chainNameWrapper}>
                                <ChainIcon className={styles.chainIcon} />
                                <Typography>{option.data.name}</Typography>
                            </div>
                            <Typography weight="medium">
                                {formatUsdAmount({
                                    amount: option.totalUsdValue,
                                })}
                            </Typography>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}

const PLACEHOLDER = new Array(3).fill(null);

export function ChainsSkeleton() {
    return (
        <Card className={styles.root}>
            <Skeleton width={60} className={styles.header} />
            {PLACEHOLDER.map((_, i) => {
                return (
                    <div key={i} className={styles.row}>
                        <div className={styles.chainNameWrapper}>
                            <Skeleton className={styles.chainIcon} />
                            <Skeleton width={70} />
                        </div>
                        <Skeleton width={40} />
                    </div>
                );
            })}
        </Card>
    );
}
