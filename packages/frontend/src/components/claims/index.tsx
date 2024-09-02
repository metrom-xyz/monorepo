"use client";

import { useClaims } from "@/src/hooks/useClaims";
import { Chains, ChainsSkeleton } from "./chains";
import { SupportedChain, type Claim } from "@metrom-xyz/sdk";
import { useMemo, useState } from "react";
import { type Chain } from "viem";
import { ChainOverview, SkeletonChainOverview } from "./chain-overview";
import { ChainClaims, SkeletonChainClaims } from "./chain-claims";
import { Empty } from "./empty";
import type { ChainData } from "@/src/commons";
import { celoAlfajores, holesky, mantleSepoliaTestnet } from "viem/chains";
import {
    celoAlfajoresData,
    holeskyData,
    mantleSepoliaData,
} from "@/src/commons/chains";

import styles from "./styles.module.css";

export interface ChainWithClaimsData {
    chain: Chain;
    chainData: ChainData;
    claims: Claim[];
}

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
                    chainData: celoAlfajoresData,
                    claims: [],
                },
                [SupportedChain.Holesky]: {
                    chain: holesky,
                    chainData: holeskyData,
                    claims: [],
                },
                [SupportedChain.MantleSepolia]: {
                    chain: mantleSepoliaTestnet,
                    data: mantleSepoliaData,
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
