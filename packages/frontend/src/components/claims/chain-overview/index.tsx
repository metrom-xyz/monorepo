import classNames from "classnames";
import type { ChainWithClaimsData } from "..";
import { Typography, Button, Skeleton, Card } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import {
    useAccount,
    usePublicClient,
    useSimulateContract,
    useSwitchChain,
    useWriteContract,
} from "wagmi";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import { useCallback, useState } from "react";
import { trackFathomEvent } from "@/src/utils/fathom";
import { toast } from "sonner";
import { ClaimSuccess } from "../notification/claim-success";
import type { WriteContractErrorType } from "viem";
import { ClaimFail } from "../notification/claim-fail";

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
                          amount: claim.amount.raw,
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
                    throw new Error("Transaction reverted");
                }

                toast.custom((toastId) => <ClaimSuccess toastId={toastId} />);
                setClaimed(true);
                trackFathomEvent("CLICK_CLAIM_ALL");
            } catch (error) {
                if (
                    !(error as WriteContractErrorType).message.includes(
                        "User rejected",
                    )
                )
                    toast.custom((toastId) => (
                        <ClaimFail
                            toastId={toastId}
                            message={t("notification.fail.message")}
                        />
                    ));

                console.warn("Could not claim", error);
            } finally {
                setClaiming(false);
            }
        };
        void create();
    }, [
        t,
        chainWithClaimsData.chain.id,
        publicClient,
        simulatedClaimAll,
        switchChainAsync,
        writeContractAsync,
    ]);

    return (
        <Card className={classNames(styles.root, className)}>
            <div className={styles.chainNameWrapper}>
                <ChainIcon className={styles.chainIcon} />
                <Typography variant="xl4" truncate>
                    {chainWithClaimsData.chain.name}
                </Typography>
            </div>
            <Button
                size="xsmall"
                disabled={simulateClaimAllErrored || claimed}
                loading={simulatingClaimAll || claiming}
                iconPlacement="right"
                onClick={handleClaimAll}
            >
                {simulatingClaimAll
                    ? t("loading")
                    : claiming
                      ? t("claimingAll")
                      : t("claimAll")}
            </Button>
        </Card>
    );
}

export function SkeletonChainOverview() {
    return (
        <Card className={styles.root}>
            <div className={styles.chainNameWrapper}>
                <Skeleton className={styles.chainIcon} />
                <Skeleton width={100} variant="xl2" />
            </div>
            <Button size="xsmall" loading />
        </Card>
    );
}
