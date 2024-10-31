import classNames from "classnames";
import { Typography, Skeleton, Card } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import type { Chain } from "viem";
import type { ChainData } from "@/src/commons";

import styles from "./styles.module.css";

export interface ChainOption {
    chain: Chain;
    data: ChainData;
}

interface ChainsProps {
    className?: string;
    options: ChainOption[];
    value: Chain | null;
    onChange: (value: Chain) => void;
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
                            key={option.chain.id}
                            className={classNames(
                                styles.row,
                                styles.rowAnimated,
                                {
                                    [styles.rowActive]:
                                        option.chain.id === value?.id,
                                },
                            )}
                            onClick={() => onChange(option.chain)}
                        >
                            <ChainIcon className={styles.chainIcon} />
                            <Typography>{option.chain.name}</Typography>
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
                        <Skeleton className={styles.chainIcon} />
                        <Skeleton width={70} />
                    </div>
                );
            })}
        </Card>
    );
}
