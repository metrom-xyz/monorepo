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
            <ChainClaims loading={loading} claimableFees={claimableFees} />
        </div>
    );
}
