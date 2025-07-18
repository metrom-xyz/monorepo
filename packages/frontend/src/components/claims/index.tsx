"use client";

import { useClaims } from "@/src/hooks/use-claims";
import { Chains, ChainsSkeleton, type ChainOption } from "./chains";
import { SupportedChain } from "@metrom-xyz/contracts";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ChainOverview, SkeletonChainOverview } from "./chain-overview";
import { ChainClaims, SkeletonChainClaims } from "./chain-claims";
import { Empty } from "./empty";
import { useReimbursements } from "@/src/hooks/use-reimbursements";
import { ChainReimbursements } from "./chain-reimbursements";
import { useSwitchChain } from "wagmi";
import type {
    ClaimWithRemaining,
    ReimbursementsWithRemaining,
} from "@/src/types/campaign";
import { type ChainData } from "@metrom-xyz/chains";
import { getChainData } from "@/src/utils/chain";
import { useAccount } from "@/src/hooks/use-account";

import styles from "./styles.module.css";

enum RewardType {
    Claim = "Claim",
    Reimbursement = "Reimbursement",
}

export interface ChainWithRewardsData {
    chainId: number;
    chainData: ChainData;
    claims: ClaimWithRemaining[];
    reimbursements: ReimbursementsWithRemaining[];
    totalUsdValue: number;
}

export function Claims() {
    const [chainId, setChainId] = useState<number | null>(null);
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

                    const chainData = getChainData(chainId);
                    if (!chainData) {
                        console.warn(
                            `Claim detected on non-supported chain with id ${chainId}`,
                        );
                        return acc;
                    }

                    if (!acc[chainId] && chainId)
                        acc[chainId] = {
                            chainId,
                            chainData,
                            claims: [],
                            reimbursements: [],
                            totalUsdValue: 0,
                        };

                    const data = acc[chainId];
                    if (!data) {
                        console.warn(
                            `Claim detected on non-supported chain with id ${chainId}`,
                        );
                        return acc;
                    }

                    data.totalUsdValue += reward.remaining.usdValue;

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

        return chainsWithRewardsData
            .map(({ chainId, totalUsdValue }) => {
                const chainData = getChainData(chainId);
                if (!chainData) return null;

                return { chainId, data: chainData, totalUsdValue };
            })
            .filter((data) => !!data);
    }, [chainsWithRewardsData]);

    const chainWithRewardsData = useMemo(() => {
        if (!chainId || !chainsWithRewardsData) return undefined;
        return chainsWithRewardsData.find((data) => data.chainId === chainId);
    }, [chainId, chainsWithRewardsData]);

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
            if (!chainId || !chainWithRewardsData)
                setChainId(chainsData[0].chainId);
    }, [
        loadingClaims,
        loadingReimbursements,
        chainWithRewardsData,
        chainId,
        chainsData,
    ]);

    const onChainSwitch = useCallback(
        (chainId: number) => {
            switchChain({ chainId });
            setChainId(chainId);
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
                value={chainId}
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
                    chainId={chainWithRewardsData.chainId}
                    claims={chainWithRewardsData.claims}
                    claimingAll={claimingAll}
                    onClaim={invalidateClaims}
                />
                {chainWithRewardsData.reimbursements.length > 0 && (
                    <ChainReimbursements
                        chainId={chainWithRewardsData.chainId}
                        reimbursements={chainWithRewardsData.reimbursements}
                        recoveringAll={recoveringAll}
                        onRecover={invalidateReimbursements}
                    />
                )}
            </div>
        </div>
    );
}
