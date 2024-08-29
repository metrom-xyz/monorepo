"use client";

import { useClaims } from "@/src/hooks/useClaims";
import { Chains } from "./chains";
import { SupportedChain, type Claim } from "@metrom-xyz/sdk";
import { useMemo, useState } from "react";
import { type Chain } from "viem";
import { celoAlfajores, holesky, mantleSepoliaTestnet } from "viem/chains";
import { ChainOverview } from "./chain-overview";
import { ChainClaims } from "./chain-claims";

import styles from "./styles.module.css";

export interface ChainWithClaimsData {
    chain: Chain;
    claims: Claim[];
}

// TODO: i18n
export function Claims() {
    const { loading, claims } = useClaims();

    const chainsWithClaimsData = useMemo(() => {
        if (loading || claims.length === 0) return [];
        const reduced = claims.reduce(
            (acc, claim) => {
                const data = acc[claim.chainId as SupportedChain];
                if (!data) {
                    console.warn(
                        `Claim detected on non-supported chain with id ${claim.chainId}`,
                    );
                    return acc;
                }
                data.claims.push(claim);
                return acc;
            },
            {
                [SupportedChain.CeloAlfajores]: {
                    chain: celoAlfajores,
                    claims: [],
                },
                [SupportedChain.Holesky]: {
                    chain: holesky,
                    claims: [],
                },
                [SupportedChain.MantleSepolia]: {
                    chain: mantleSepoliaTestnet,
                    claims: [],
                },
            } as Record<SupportedChain, ChainWithClaimsData>,
        );

        return Object.values(reduced);
    }, [claims, loading]);

    const [chainWithClaimsData, setChainWithClaimsData] =
        useState<ChainWithClaimsData | null>(
            chainsWithClaimsData.length === 0 ? null : chainsWithClaimsData[0],
        );

    return (
        <div className={styles.root}>
            <Chains
                options={chainsWithClaimsData}
                value={chainWithClaimsData}
                onChange={setChainWithClaimsData}
            />
            <div className={styles.rightWrapper}>
                {chainWithClaimsData ? (
                    <>
                        <ChainOverview
                            chainWithClaimsData={chainWithClaimsData}
                        />
                        <ChainClaims
                            chainWithClaimsData={chainWithClaimsData}
                        />
                    </>
                ) : (
                    <div>No claims</div>
                )}
            </div>
        </div>
    );
}
