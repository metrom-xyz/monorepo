import { type Erc20Token, type UsdPricedErc20Token } from "@metrom-xyz/sdk";
import { useMemo } from "react";
import { type Address } from "viem";
import { TokenReimbursement } from "./token-reimbursement";
import type { ChainWithRewardsData } from "..";
import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import type { ReimbursementsWithRemaining } from "@/src/types/campaign/common";

import styles from "./styles.module.css";

type ChainReimbursementProps = {
    recoveringAll?: boolean;
    onRecover: (token: Erc20Token) => void;
} & Omit<ChainWithRewardsData, "claims" | "chainData" | "totalUsdValue">;

export interface TokenReimbursements {
    token: UsdPricedErc20Token;
    reimbursements: ReimbursementsWithRemaining[];
    totalAmount: number;
}

export function ChainReimbursements({
    onRecover,
    chainId,
    reimbursements,
    recoveringAll,
}: ChainReimbursementProps) {
    const t = useTranslations("rewards.reimbursements");

    const perToken = useMemo(() => {
        const reduced = reimbursements.reduce(
            (acc, reimbursement) => {
                if (!acc[reimbursement.token.address]) {
                    acc[reimbursement.token.address] = {
                        token: reimbursement.token,
                        reimbursements: [],
                        totalAmount: 0,
                    };
                }
                acc[reimbursement.token.address].reimbursements.push(
                    reimbursement,
                );
                acc[reimbursement.token.address].totalAmount +=
                    reimbursement.remaining.formatted;
                return acc;
            },
            {} as Record<Address, TokenReimbursements>,
        );
        return Object.values(reduced);
    }, [reimbursements]);

    return (
        <div className={styles.root}>
            <Typography weight="medium" size="xl" uppercase>
                {t("title")}
            </Typography>
            <div className={styles.listWrapper}>
                {perToken.map((tokenReimbursement) => {
                    return (
                        <TokenReimbursement
                            key={tokenReimbursement.token.address}
                            chainId={chainId}
                            tokenReimbursements={tokenReimbursement}
                            recoveringAll={recoveringAll}
                            onRecover={onRecover}
                        />
                    );
                })}
            </div>
        </div>
    );
}
