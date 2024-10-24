"use client";

import { useClaims } from "@/src/hooks/useClaims";
import { Chains, ChainsSkeleton } from "./chains";
import { SupportedChain } from "@metrom-xyz/contracts";
import { type Claim, type Reimbursement } from "@metrom-xyz/sdk";
import { useEffect, useMemo, useState } from "react";
import { type Chain } from "viem";
import { ChainOverview, SkeletonChainOverview } from "./chain-overview";
import { ChainClaims, SkeletonChainClaims } from "./chain-claims";
import { Empty } from "./empty";
import { CHAIN_DATA, SUPPORTED_CHAINS, type ChainData } from "@/src/commons";
import { useReimbursements } from "@/src/hooks/useReimbursements";
import { ChainReimbursements } from "./chain-reimbursements";

import styles from "./styles.module.css";

enum RewardType {
    claim = "claim",
    reimbursement = "reimbursement",
}

export interface ChainWithRewardsData {
    chain: Chain;
    chainData: ChainData;
    claims: Claim[];
    reimbursements: Reimbursement[];
}

export function Claims() {
    const [chainWithRewardsData, setChainWithRewardsData] =
        useState<ChainWithRewardsData | null>(null);
    const [initializing, setInitializing] = useState(false);
    const [claimingAll, setClaimingAll] = useState(false);
    const [recoveringAll, setRecoveringAll] = useState(false);

    const { loading: loadingClaims, claims } = useClaims();
    const { loading: loadingReimbursements, reimbursements } =
        useReimbursements();

    const chainsWithRewardsData = useMemo(() => {
        if (
            loadingClaims ||
            loadingReimbursements ||
            (claims.length === 0 && reimbursements.length === 0)
        )
            return [];

        setInitializing(true);

        const rewards = [
            ...claims.map((claim) => ({ ...claim, type: RewardType.claim })),
            ...reimbursements.map((reimbursement) => ({
                ...reimbursement,
                type: RewardType.reimbursement,
            })),
        ];

        const reducedRewards = rewards.reduce(
            (acc, reward) => {
                const chainId = reward.chainId as SupportedChain;
                const chain = SUPPORTED_CHAINS.find(({ id }) => id === chainId);

                if (!acc[chainId] && chain)
                    acc[chainId] = {
                        chain: chain,
                        chainData: CHAIN_DATA[chainId],
                        claims: [],
                        reimbursements: [],
                    };

                const data = acc[chainId];
                if (!data) {
                    console.warn(
                        `Claim detected on non-supported chain with id ${reward.chainId}`,
                    );
                    return acc;
                }

                if (reward.type === RewardType.claim) data.claims.push(reward);
                else data.reimbursements.push(reward);
                return acc;
            },
            {} as Record<SupportedChain, ChainWithRewardsData>,
        );

        return Object.values(reducedRewards).sort(
            (a, b) => b.claims.length - a.claims.length,
        );
    }, [claims, loadingClaims, loadingReimbursements, reimbursements]);

    useEffect(() => {
        if (!loadingClaims && !loadingReimbursements) {
            setChainWithRewardsData(
                chainsWithRewardsData.length > 0
                    ? chainsWithRewardsData[0]
                    : null,
            );
            setInitializing(false);
        }
    }, [chainsWithRewardsData, loadingClaims, loadingReimbursements]);

    if (loadingClaims || loadingReimbursements || initializing) {
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
    if (!chainWithRewardsData) {
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
                options={chainsWithRewardsData}
                value={chainWithRewardsData}
                onChange={setChainWithRewardsData}
            />
            <div className={styles.rightWrapper}>
                <ChainOverview
                    chainWithRewardsData={chainWithRewardsData}
                    onClaiming={setClaimingAll}
                    onRecovering={setRecoveringAll}
                />
                <ChainClaims
                    chain={chainWithRewardsData.chain}
                    claims={chainWithRewardsData.claims}
                    claimingAll={claimingAll}
                />
                {chainWithRewardsData.reimbursements.length > 0 && (
                    <ChainReimbursements
                        chain={chainWithRewardsData.chain}
                        reimbursements={chainWithRewardsData.reimbursements}
                        recoveringAll={recoveringAll}
                    />
                )}
            </div>
        </div>
    );
}
