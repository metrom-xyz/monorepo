"use client";

import { useClaims } from "@/src/hooks/useClaims";
import { Chains, ChainsSkeleton, type ChainOption } from "./chains";
import { SupportedChain } from "@metrom-xyz/contracts";
import { useCallback, useEffect, useMemo, useState } from "react";
import { type Chain } from "viem";
import { ChainOverview, SkeletonChainOverview } from "./chain-overview";
import { ChainClaims, SkeletonChainClaims } from "./chain-claims";
import { Empty } from "./empty";
import { CHAIN_DATA, SUPPORTED_CHAINS, type ChainData } from "@/src/commons";
import { useReimbursements } from "@/src/hooks/useReimbursements";
import { ChainReimbursements } from "./chain-reimbursements";
import { useAccount, useSwitchChain } from "wagmi";
import type {
    ClaimWithRemaining,
    ReimbursementsWithRemaining,
} from "@/src/types/campaign";

import styles from "./styles.module.css";

enum RewardType {
    Claim = "Claim",
    Reimbursement = "Reimbursement",
}

export interface ChainWithRewardsData {
    chain: Chain;
    chainData: ChainData;
    claims: ClaimWithRemaining[];
    reimbursements: ReimbursementsWithRemaining[];
    totalUsdValue: number;
}

export function Claims() {
    const [chain, setChain] = useState<Chain | null>(null);
    const [claimingAll, setClaimingAll] = useState(false);
    const [recoveringAll, setRecoveringAll] = useState(false);

    const { address } = useAccount();
    const { switchChain } = useSwitchChain();
    const {
        loading: loadingClaims,
        claims,
        invalidate: invalidateClaims,
    } = useClaims();
    const {
        loading: loadingReimbursements,
        reimbursements,
        invalidate: invalidateReimbursements,
    } = useReimbursements();

    const chainsWithRewardsData: ChainWithRewardsData[] | undefined =
        useMemo(() => {
            if (
                !address ||
                loadingClaims ||
                loadingReimbursements ||
                !claims ||
                !reimbursements
            )
                return undefined;

            const rewards = [
                ...claims.map((claim) => ({
                    ...claim,
                    type: RewardType.Claim,
                })),
                ...reimbursements.map((reimbursement) => ({
                    ...reimbursement,
                    type: RewardType.Reimbursement,
                })),
            ];

            const reducedRewards = rewards.reduce(
                (acc, reward) => {
                    const chainId = reward.chainId as SupportedChain;
                    const chain = SUPPORTED_CHAINS.find(
                        ({ id }) => id === chainId,
                    );

                    if (!acc[chainId] && chain)
                        acc[chainId] = {
                            chain: chain,
                            chainData: CHAIN_DATA[chainId],
                            claims: [],
                            reimbursements: [],
                            totalUsdValue: 0,
                        };

                    const data = acc[chainId];
                    if (!data) {
                        console.warn(
                            `Claim detected on non-supported chain with id ${reward.chainId}`,
                        );
                        return acc;
                    }

                    data.totalUsdValue += reward.amount.usdValue;

                    if (reward.type === RewardType.Claim)
                        data.claims.push(reward);
                    else data.reimbursements.push(reward);
                    return acc;
                },
                {} as Record<SupportedChain, ChainWithRewardsData>,
            );

            return Object.values(reducedRewards).sort(
                (a, b) => b.claims.length - a.claims.length,
            );
        }, [
            address,
            claims,
            loadingClaims,
            loadingReimbursements,
            reimbursements,
        ]);

    const chainsData: ChainOption[] | undefined = useMemo(() => {
        if (!chainsWithRewardsData) return undefined;

        return chainsWithRewardsData.map(({ chain, totalUsdValue }) => ({
            chain,
            data: CHAIN_DATA[chain.id as SupportedChain],
            totalUsdValue,
        }));
    }, [chainsWithRewardsData]);

    const chainWithRewardsData = useMemo(() => {
        if (!chain || !chainsWithRewardsData) return undefined;
        return chainsWithRewardsData.find((data) => data.chain.id === chain.id);
    }, [chain, chainsWithRewardsData]);

    const initializing = useMemo(() => {
        if (!address) return false;

        if (
            loadingClaims ||
            loadingReimbursements ||
            !claims ||
            !reimbursements
        )
            return true;

        return (
            (claims.length > 0 || reimbursements.length > 0) &&
            (!chainsWithRewardsData || !chainsData || !chainWithRewardsData)
        );
    }, [
        address,
        loadingClaims,
        loadingReimbursements,
        claims,
        reimbursements,
        chainsData,
        chainsWithRewardsData,
        chainWithRewardsData,
    ]);

    useEffect(() => {
        if (
            !loadingClaims &&
            !loadingReimbursements &&
            chainsData &&
            chainsData.length > 0
        )
            if (!chain || !chainWithRewardsData) setChain(chainsData[0].chain);
    }, [
        loadingClaims,
        loadingReimbursements,
        chainWithRewardsData,
        chain,
        chainsData,
    ]);

    const onChainSwitch = useCallback(
        (chain: Chain) => {
            switchChain({ chainId: chain.id });
            setChain(chain);
        },
        [switchChain],
    );

    if (initializing) {
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
            <Chains
                options={chainsData}
                value={chain}
                onChange={onChainSwitch}
            />
            <div className={styles.rightWrapper}>
                <ChainOverview
                    chainWithRewardsData={chainWithRewardsData}
                    onClaimAll={invalidateClaims}
                    onClaiming={setClaimingAll}
                    onRecovering={setRecoveringAll}
                    onRecoverAll={invalidateReimbursements}
                />
                <ChainClaims
                    chain={chainWithRewardsData.chain}
                    claims={chainWithRewardsData.claims}
                    claimingAll={claimingAll}
                    onClaim={invalidateClaims}
                />
                {chainWithRewardsData.reimbursements.length > 0 && (
                    <ChainReimbursements
                        chain={chainWithRewardsData.chain}
                        reimbursements={chainWithRewardsData.reimbursements}
                        recoveringAll={recoveringAll}
                        onRecover={invalidateReimbursements}
                    />
                )}
            </div>
        </div>
    );
}
