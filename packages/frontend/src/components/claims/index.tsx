"use client";

import { useClaims } from "@/src/hooks/useClaims";
import { Chains, ChainsSkeleton, type ChainOption } from "./chains";
import { SupportedChain } from "@metrom-xyz/contracts";
import {
    type Claim,
    type Erc20Token,
    type Reimbursement,
} from "@metrom-xyz/sdk";
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
    Claim = "Claim",
    Reimbursement = "Reimbursement",
}

export interface ChainWithRewardsData {
    chain: Chain;
    chainData: ChainData;
    claims: Claim[];
    reimbursements: Reimbursement[];
}

export function Claims() {
    const [chain, setChain] = useState<Chain | null>(null);
    const [chainsWithRewardsData, setChainsWithRewardsData] =
        useState<ChainWithRewardsData[]>();
    const [initializing, setInitializing] = useState(false);
    const [claimingAll, setClaimingAll] = useState(false);
    const [recoveringAll, setRecoveringAll] = useState(false);

    const { loading: loadingClaims, claims } = useClaims();
    const { loading: loadingReimbursements, reimbursements } =
        useReimbursements();

    useEffect(() => {
        if (
            loadingClaims ||
            loadingReimbursements ||
            (claims.length === 0 && reimbursements.length === 0)
        )
            return;

        setInitializing(true);

        const rewards = [
            ...claims.map((claim) => ({ ...claim, type: RewardType.Claim })),
            ...reimbursements.map((reimbursement) => ({
                ...reimbursement,
                type: RewardType.Reimbursement,
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

                if (reward.type === RewardType.Claim) data.claims.push(reward);
                else data.reimbursements.push(reward);
                return acc;
            },
            {} as Record<SupportedChain, ChainWithRewardsData>,
        );

        setChainsWithRewardsData(
            Object.values(reducedRewards).sort(
                (a, b) => b.claims.length - a.claims.length,
            ),
        );
    }, [claims, loadingClaims, loadingReimbursements, reimbursements]);

    const chainsData: ChainOption[] | undefined = useMemo(() => {
        if (!chainsWithRewardsData) return undefined;

        return chainsWithRewardsData.map(({ chain }) => ({
            chain,
            data: CHAIN_DATA[chain.id as SupportedChain],
        }));
    }, [chainsWithRewardsData]);

    const chainWithRewardsData = useMemo(() => {
        if (!chain || !chainsWithRewardsData) return undefined;
        return chainsWithRewardsData.find((data) => data.chain.id === chain.id);
    }, [chain, chainsWithRewardsData]);

    useEffect(() => {
        if (!loadingClaims && !loadingReimbursements && chainsData) {
            if (!chain) setChain(chainsData[0].chain);
            setInitializing(false);
        }
    }, [
        chainsWithRewardsData,
        loadingClaims,
        loadingReimbursements,
        chainWithRewardsData,
        chain,
        chainsData,
    ]);

    function onTokenAllClaimed(chain: Chain) {
        setChainsWithRewardsData((prev) =>
            prev?.map((data) => {
                if (data.chain !== chain) return data;
                return {
                    ...data,
                    claims: [],
                };
            }),
        );
    }

    function onTokenAllRecovered(chain: Chain) {
        setChainsWithRewardsData((prev) =>
            prev?.map((data) => {
                if (data.chain !== chain) return data;
                return { ...data, reimbursements: [] };
            }),
        );
    }

    function onTokenClaimed(token: Erc20Token) {
        setChainsWithRewardsData((prev) =>
            prev?.map((data) => ({
                ...data,
                claims: data.claims.filter(
                    (claim) => claim.token.address !== token.address,
                ),
            })),
        );
    }

    function onTokenRecovered(token: Erc20Token) {
        setChainsWithRewardsData((prev) =>
            prev?.map((data) => ({
                ...data,
                reimbursements: data.reimbursements.filter(
                    (claim) => claim.token.address !== token.address,
                ),
            })),
        );
    }

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
    if (!chainsWithRewardsData || !chainsData || !chainWithRewardsData) {
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
            <Chains options={chainsData} value={chain} onChange={setChain} />
            <div className={styles.rightWrapper}>
                <ChainOverview
                    chainWithRewardsData={chainWithRewardsData}
                    onClaimAll={onTokenAllClaimed}
                    onClaiming={setClaimingAll}
                    onRecovering={setRecoveringAll}
                    onRecoverAll={onTokenAllRecovered}
                />
                <ChainClaims
                    chain={chainWithRewardsData.chain}
                    claims={chainWithRewardsData.claims}
                    claimingAll={claimingAll}
                    onClaim={onTokenClaimed}
                />
                {chainWithRewardsData.reimbursements.length > 0 && (
                    <ChainReimbursements
                        chain={chainWithRewardsData.chain}
                        reimbursements={chainWithRewardsData.reimbursements}
                        recoveringAll={recoveringAll}
                        onRecover={onTokenRecovered}
                    />
                )}
            </div>
        </div>
    );
}
