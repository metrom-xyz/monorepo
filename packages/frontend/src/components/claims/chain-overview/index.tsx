import classNames from "@/src/utils/classes";
import type { ChainWithClaimsData } from "..";
import { Typography } from "@/src/ui/typography";
import { Button } from "@/src/ui/button";
import { useTranslations } from "next-intl";
import {
    useAccount,
    usePublicClient,
    useSimulateContract,
    useSwitchChain,
    useWriteContract,
} from "wagmi";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import { parseUnits } from "viem";
import { useCallback, useEffect, useState } from "react";
import { Skeleton } from "@/src/ui/skeleton";

import styles from "./styles.module.css";

interface ChainOverviewProps {
    className?: string;
    chainWithClaimsData: ChainWithClaimsData;
}

export function ChainOverview({
    className,
    chainWithClaimsData,
}: ChainOverviewProps) {
    const t = useTranslations("claims");
    const { address: account } = useAccount();
    const publicClient = usePublicClient();
    const { switchChainAsync } = useSwitchChain();
    const { writeContractAsync } = useWriteContract();

    const [claiming, setClaiming] = useState(false);
    const [claimed, setClaimed] = useState(false);

    const ChainIcon = chainWithClaimsData.chainData.icon;

    const {
        data: simulatedClaimAll,
        isLoading: simulatingClaimAll,
        isError: simulateClaimAllErrored,
    } = useSimulateContract({
        chainId: chainWithClaimsData.chain.id,
        abi: metromAbi,
        address: chainWithClaimsData.chainData.metromContract.address,
        functionName: "claimRewards",
        args: [
            !account
                ? []
                : chainWithClaimsData.claims.map((claim) => {
                      return {
                          campaignId: claim.campaignId,
                          proof: claim.proof,
                          token: claim.token.address,
                          amount: parseUnits(
                              claim.amount.toFixed(claim.token.decimals),
                              claim.token.decimals,
                          ),
                          receiver: account,
                      };
                  }),
        ],
        query: {
            enabled: account && chainWithClaimsData.claims.length > 0,
        },
    });

    const handleClaimAll = useCallback(() => {
        if (!writeContractAsync || !publicClient || !simulatedClaimAll?.request)
            return;
        const create = async () => {
            setClaiming(true);
            try {
                await switchChainAsync({
                    chainId: chainWithClaimsData.chain.id,
                });

                const tx = await writeContractAsync(simulatedClaimAll.request);
                const receipt = await publicClient.waitForTransactionReceipt({
                    hash: tx,
                });

                if (receipt.status === "reverted") {
                    console.warn("Claim transaction reverted");
                    return;
                }

                setClaimed(true);
            } catch (error) {
                console.warn("Could not claim", error);
            } finally {
                setClaiming(false);
            }
        };
        void create();
    }, [
        chainWithClaimsData.chain.id,
        publicClient,
        simulatedClaimAll,
        switchChainAsync,
        writeContractAsync,
    ]);

    return (
        <div className={classNames(styles.root, className)}>
            <div className={styles.chainNameWrapper}>
                <ChainIcon className={styles.chainIcon} />
                <Typography variant="xl4">
                    {chainWithClaimsData.chain.name}
                </Typography>
            </div>
            <Button
                size="xsmall"
                disabled={simulateClaimAllErrored || claimed}
                loading={simulatingClaimAll || claiming}
                onClick={handleClaimAll}
            >
                {t("claimAll")}
            </Button>
        </div>
    );
}

export function SkeletonChainOverview() {
    return (
        <div className={styles.root}>
            <div className={styles.chainNameWrapper}>
                <Skeleton className={styles.chainIcon} />
                <Skeleton width={100} variant="xl2" />
            </div>
            <Button size="xsmall" loading />
        </div>
    );
}
