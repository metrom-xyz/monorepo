import classNames from "classnames";
import { Typography, Skeleton, Select } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import type { ChainWithClaimsData } from "..";

import styles from "./styles.module.css";

interface ChainsProps {
    className?: string;
    options: ChainWithClaimsData[];
    value: ChainWithClaimsData | null;
    onChange: (value: ChainWithClaimsData) => void;
}

export function Chains({ className, options, value, onChange }: ChainsProps) {
    const t = useTranslations("claims");

    return (
        <div className={classNames(styles.root, className)}>
            <Typography light weight="medium" className={styles.header}>
                {t("chain")}
            </Typography>
            <div className={styles.chainsWrapper}>
                {options.map((option) => {
                    if (option.claims.length === 0) return null;

                    const ChainIcon = option.chainData.icon;

                    return (
                        <div
                            key={option.chain.id}
                            className={classNames(
                                styles.row,
                                styles.rowAnimated,
                                {
                                    [styles.rowActive]:
                                        option.chain.id === value?.chain.id,
                                },
                            )}
                            onClick={() => onChange(option)}
                        >
                            <ChainIcon className={styles.chainIcon} />
                            <Typography>{option.chain.name}</Typography>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const PLACEHOLDER = new Array(3).fill(null);

export function ChainsSkeleton() {
    return (
        <div className={styles.root}>
            <Skeleton width={60} className={styles.header} />
            {PLACEHOLDER.map((_, i) => {
                return (
                    <div key={i} className={styles.row}>
                        <Skeleton className={styles.chainIcon} />
                        <Skeleton width={70} />
                    </div>
                );
            })}
        </div>
    );
}
