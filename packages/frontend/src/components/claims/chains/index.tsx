import classNames from "@/src/utils/classes";
import { Typography } from "@/src/ui/typography";
import { useTranslations } from "next-intl";
import type { ChainWithClaimsData } from "..";
import { SUPPORTED_CHAIN_ICONS } from "@/src/commons";
import type { SupportedChain } from "@metrom-xyz/contracts";

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
            {options.map((option) => {
                if (option.claims.length === 0) return null;

                const ChainIcon =
                    SUPPORTED_CHAIN_ICONS[option.chain.id as SupportedChain];

                return (
                    <div
                        key={option.chain.id}
                        className={classNames(styles.row, {
                            [styles.rowActive]:
                                option.chain.id === value?.chain.id,
                        })}
                        onClick={() => onChange(option)}
                    >
                        <ChainIcon className={styles.chainIcon} />
                        <Typography>{option.chain.name}</Typography>
                    </div>
                );
            })}
        </div>
    );
}
