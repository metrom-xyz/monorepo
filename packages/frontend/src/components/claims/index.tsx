"use client";

import { useClaims } from "@/src/hooks/useClaims";
import { Chains, ChainsSkeleton } from "./chains";
import { SupportedChain, type Claim } from "@metrom-xyz/sdk";
import { useEffect, useMemo, useState } from "react";
import { type Chain } from "viem";
import { ChainOverview, SkeletonChainOverview } from "./chain-overview";
import { ChainClaims, SkeletonChainClaims } from "./chain-claims";
import { Empty } from "./empty";
import type { ChainData } from "@/src/commons";
import {
    celoAlfajores,
    holesky,
    mantleSepoliaTestnet,
    mode,
} from "viem/chains";
import {
    celoAlfajoresData,
    holeskyData,
    mantleSepoliaData,
    modeData,
} from "@/src/commons/chains";

import styles from "./styles.module.css";

export interface ChainWithClaimsData {
    chain: Chain;
    chainData: ChainData;
    claims: Claim[];
}

export function Claims() {
    const [chainWithClaimsData, setChainWithClaimsData] =
        useState<ChainWithClaimsData | null>(null);
    const [initializing, setInitializing] = useState(false);

    const { loading, claims } = useClaims();

    const chainsWithClaimsData = useMemo(() => {
        if (loading || claims.length === 0) return [];
        setInitializing(true);
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
                [SupportedChain.Mode]: {
                    chain: mode,
                    chainData: modeData,
                    claims: [],
                },
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
                    chainData: mantleSepoliaData,
                    claims: [],
                },
            } as Record<SupportedChain, ChainWithClaimsData>,
        );

        return Object.values(reduced).sort(
            (a, b) => b.claims.length - a.claims.length,
        );
    }, [claims, loading]);

    useEffect(() => {
        if (!loading) {
            setChainWithClaimsData(
                chainsWithClaimsData.length > 0
                    ? chainsWithClaimsData[0]
                    : null,
            );
            setInitializing(false);
        }
    }, [chainsWithClaimsData, loading]);

    if (loading || initializing) {
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

    // FIXME: fix the empty state flickering after the loading is completed
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
