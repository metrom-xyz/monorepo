import { ClaimableFees } from "@/hooks/useClaimableFees";
import { Overview } from "./overview";
import { useMemo } from "react";
import { useChainId } from "wagmi";
import { TokenClaim } from "./token-claim";

import styles from "./styles.module.css";

interface ChainClaimsProps {
    loading: boolean;
    claimableFees?: ClaimableFees;
}

export function ChainClaims({ loading, claimableFees }: ChainClaimsProps) {
    const chainId = useChainId();

    const claims = useMemo(() => {
        if (!claimableFees || !claimableFees[chainId]) return undefined;
        return claimableFees[chainId];
    }, [claimableFees, chainId]);

    const sortedTokens = claims?.tokens
        .filter(({ amount }) => amount.raw > 0n)
        .sort((a, b) => b.amount.usdValue - a.amount.formatted);

    return (
        <div className={styles.root}>
            <Overview
                loading={loading}
                chain={claims?.chain.name}
                icon={claims?.chain.icon}
                totalUsd={claims?.totalUsd}
                tokens={sortedTokens}
            />
            <div className={styles.claims}>
                {sortedTokens?.map((claim) => (
                    <TokenClaim key={claim.token.address} {...claim} />
                ))}
            </div>
        </div>
    );
}
