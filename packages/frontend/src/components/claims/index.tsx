"use client";

import { useClaims } from "@/src/hooks/useClaims";
import { Chains, ChainsSkeleton } from "./chains";
import { SupportedChain, type Claim } from "@metrom-xyz/sdk";
import { useMemo, useState } from "react";
import { type Chain } from "viem";
import { celoAlfajores, holesky, mantleSepoliaTestnet } from "viem/chains";
import { ChainOverview, SkeletonChainOverview } from "./chain-overview";
import { ChainClaims, SkeletonChainClaims } from "./chain-claims";
import { Empty } from "./empty";

import styles from "./styles.module.css";
import { Typography } from "@/src/ui/typography";

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

    if (loading) {
        return (
            <div className={styles.root}>
                <ChainsSkeleton />
                <div className={styles.rightWrapper}>
                    <SkeletonChainOverview />
                    <SkeletonChainClaims />
                </div>
            </div>
        );
    }

    if (!chainWithClaimsData) {
        return (
            <div className={styles.root}>
                <div className={styles.fullSideCardWrapper}>
                    <Empty />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.root}>
            <Chains
                options={chainsWithClaimsData}
                value={chainWithClaimsData}
                onChange={setChainWithClaimsData}
            />
            <div className={styles.rightWrapper}>
                <ChainOverview chainWithClaimsData={chainWithClaimsData} />
                <ChainClaims chainWithClaimsData={chainWithClaimsData} />
            </div>
        </div>
    );
}
