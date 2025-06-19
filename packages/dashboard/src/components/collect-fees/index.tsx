"use client";

import { useClaimableFees } from "@/hooks/useClaimableFees";
import { ChainsList } from "./chains-list";
import { ChainClaims } from "./chain-claims";

import styles from "./styles.module.css";

export function CollectFees() {
    const { loading, totalUsd, claimableFees } = useClaimableFees();

    return (
        <div className={styles.root}>
            <ChainsList
                loading={loading}
                totalUsd={totalUsd}
                claimableFees={claimableFees}
            />
            <ChainClaims claimableFees={claimableFees} />
            {/* <div className={styles.container}>
                {Object.entries(claimableFees).map(([chain, claimableFee]) => {
                    const { id, name, icon: Icon } = claimableFee.chain;

                    return (
                        <div key={chain} className={styles.chain}>
                            <div>
                                <Typography>{name}</Typography>
                                <Icon className={styles.chainIcon} />
                            </div>
                            {claimableFee.tokens
                                .sort(
                                    (a, b) =>
                                        b.amount.usdValue - a.amount.usdValue,
                                )
                                .map((claimableFeeToken) => (
                                    <TokenClaim
                                        key={claimableFeeToken.token.address}
                                        chainId={Number(chain)}
                                        {...claimableFeeToken}
                                    />
                                ))}
                        </div>
                    );
                })}
            </div> */}
        </div>
    );
}
