import { type Claim, type Token } from "@metrom-xyz/sdk";
import { useMemo } from "react";
import { type Address } from "viem";
import { SkeletonTokenClaim, TokenClaim } from "./token-claim";
import type { ChainWithClaimsData } from "..";

interface ChainOverviewProps {
    chainWithClaimsData: ChainWithClaimsData;
}

export interface TokenClaims {
    token: Token;
    claims: Claim[];
    totalAmount: number;
}

export function ChainClaims({ chainWithClaimsData }: ChainOverviewProps) {
    const perToken = useMemo(() => {
        const reduced = chainWithClaimsData.claims.reduce(
            (acc, claim) => {
                if (!acc[claim.token.address]) {
                    acc[claim.token.address] = {
                        token: claim.token,
                        claims: [],
                        totalAmount: 0,
                    };
                }
                acc[claim.token.address].claims.push(claim);
                acc[claim.token.address].totalAmount += claim.amount;
                return acc;
            },
            {} as Record<Address, TokenClaims>,
        );
        return Object.values(reduced);
    }, [chainWithClaimsData]);

    return perToken.map((tokenClaims) => {
        return (
            <TokenClaim
                key={tokenClaims.token.address}
                chainId={chainWithClaimsData.chain.id}
                chainClaims={tokenClaims}
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
