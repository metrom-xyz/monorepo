import { type Claim, type Erc20Token } from "@metrom-xyz/sdk";
import { useMemo } from "react";
import { type Address } from "viem";
import { SkeletonTokenClaim, TokenClaim } from "./token-claim";
import type { ChainWithRewardsData } from "..";

type ChainOverviewProps = {
    claimingAll?: boolean;
} & Omit<ChainWithRewardsData, "reimbursements" | "chainData">;

export interface TokenClaims {
    token: Erc20Token;
    claims: Claim[];
    totalAmount: number;
}

export function ChainClaims({
    chain,
    claims,
    claimingAll,
}: ChainOverviewProps) {
    const perToken = useMemo(() => {
        const reduced = claims.reduce(
            (acc, claim) => {
                if (!acc[claim.token.address]) {
                    acc[claim.token.address] = {
                        token: claim.token,
                        claims: [],
                        totalAmount: 0,
                    };
                }
                acc[claim.token.address].claims.push(claim);
                acc[claim.token.address].totalAmount += claim.amount.formatted;
                return acc;
            },
            {} as Record<Address, TokenClaims>,
        );
        return Object.values(reduced);
    }, [claims]);

    return perToken.map((tokenClaims) => {
        return (
            <TokenClaim
                key={tokenClaims.token.address}
                chainId={chain.id}
                tokenClaims={tokenClaims}
                disabled={claimingAll}
            />
        );
    });
}

export function SkeletonChainClaims() {
    return (
        <>
            <SkeletonTokenClaim />
            <SkeletonTokenClaim />
        </>
    );
}
