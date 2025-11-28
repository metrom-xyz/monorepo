import classNames from "classnames";
import { Typography, Skeleton, Card, Button } from "@metrom-xyz/ui";
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
            <Typography
                variant="tertiary"
                weight="medium"
                className={styles.header}
            >
                {t("chain")}
            </Typography>
            <div className={styles.chainsWrapper}>
                {options.map((option) => {
                    const ChainIcon = option.data.icon;

                    return (
                        <Button
                            key={option.chainId}
                            variant="secondary"
                            onClick={() => onChange(option.chainId)}
                            className={{
                                root: classNames(styles.buttonRoot, {
                                    [styles.active]: option.chainId === value,
                                }),
                                contentWrapper: styles.buttonContentWrapper,
                            }}
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
                        </Button>
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
                    <Button
                        key={i}
                        loading
                        variant="secondary"
                        className={{
                            root: styles.buttonRoot,
                            contentWrapper: classNames(
                                styles.buttonContentWrapper,
                            ),
                        }}
                    ></Button>
                );
            })}
        </Card>
    );
}
