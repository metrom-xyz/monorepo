import classNames from "classnames";
import { Typography, Button, Skeleton, Card } from "@metrom-xyz/ui";
import type { ChainWithRewardsData } from "..";
import { useTranslations } from "next-intl";
import {
    useAccount,
    usePublicClient,
    useSimulateContract,
    useSwitchChain,
    useWriteContract,
} from "wagmi";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import { useCallback, useEffect, useState } from "react";
import { trackFathomEvent } from "@/src/utils/fathom";
import { toast } from "sonner";
import { ClaimSuccess } from "../notification/claim-success";
import type { WriteContractErrorType } from "viem";
import { ClaimFail } from "../notification/claim-fail";
import { RecoverSuccess } from "../notification/recover-success";
import { RecoverFail } from "../notification/recover-fail";

import styles from "./styles.module.css";

interface ChainOverviewProps {
    className?: string;
    chainWithRewardsData: ChainWithRewardsData;
    onClaiming?: (value: boolean) => void;
    onRecovering?: (value: boolean) => void;
}

export function ChainOverview({
    className,
    chainWithRewardsData,
    onClaiming,
    onRecovering,
}: ChainOverviewProps) {
    const t = useTranslations("rewards");
    const { address: account } = useAccount();
    const publicClient = usePublicClient();
    const { switchChainAsync } = useSwitchChain();
    const { writeContractAsync } = useWriteContract();

    const [claiming, setClaiming] = useState(false);
    const [claimed, setClaimed] = useState(false);
    const [recovering, setRecovering] = useState(false);
    const [recovered, setRecovered] = useState(false);

    const ChainIcon = chainWithRewardsData.chainData.icon;

    const {
        data: simulatedRecoverAll,
        isLoading: simulatingRecoverAll,
        isError: simulateRecoverAllErrored,
    } = useSimulateContract({
        chainId: chainWithRewardsData.chain.id,
        abi: metromAbi,
        address: chainWithRewardsData.chainData.metromContract.address,
        functionName: "recoverRewards",
        args: [
            !account
                ? []
                : chainWithRewardsData.reimbursements.map((reimbursement) => {
                      return {
                          campaignId: reimbursement.campaignId,
                          proof: reimbursement.proof,
                          token: reimbursement.token.address,
                          amount: reimbursement.amount.raw,
                          receiver: account,
                      };
                  }),
        ],
        query: {
            refetchOnMount: false,
            enabled:
                !!account && chainWithRewardsData.reimbursements.length > 0,
        },
    });

    const {
        data: simulatedClaimAll,
        isLoading: simulatingClaimAll,
        isError: simulateClaimAllErrored,
    } = useSimulateContract({
        chainId: chainWithRewardsData.chain.id,
        abi: metromAbi,
        address: chainWithRewardsData.chainData.metromContract.address,
        functionName: "claimRewards",
        args: [
            !account
                ? []
                : chainWithRewardsData.claims.map((claim) => {
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
            enabled: account && chainWithRewardsData.claims.length > 0,
        },
    });

    useEffect(() => {
        if (onClaiming) onClaiming(claiming);
    }, [claiming, onClaiming]);

    useEffect(() => {
        if (onRecovering) onRecovering(recovering);
    }, [recovering, onRecovering]);

    const handleRecoverAll = useCallback(() => {
        if (
            !writeContractAsync ||
            !publicClient ||
            !simulatedRecoverAll?.request
        )
            return;
        const create = async () => {
            setRecovering(true);
            try {
                await switchChainAsync({
                    chainId: chainWithRewardsData.chain.id,
                });

                const tx = await writeContractAsync(
                    simulatedRecoverAll.request,
                );
                const receipt = await publicClient.waitForTransactionReceipt({
                    hash: tx,
                });

                if (receipt.status === "reverted") {
                    console.warn("Recover transaction reverted");
                    throw new Error("Transaction reverted");
                }

                toast.custom((toastId) => <RecoverSuccess toastId={toastId} />);
                setRecovered(true);
                trackFathomEvent("CLICK_RECOVER_ALL");
            } catch (error) {
                if (
                    !(error as WriteContractErrorType).message.includes(
                        "User rejected",
                    )
                )
                    toast.custom((toastId) => (
                        <RecoverFail toastId={toastId} />
                    ));

                console.warn("Could not recover", error);
            } finally {
                setRecovering(false);
            }
        };
        void create();
    }, [
        chainWithRewardsData.chain.id,
        publicClient,
        simulatedRecoverAll,
        switchChainAsync,
        writeContractAsync,
    ]);

    const handleClaimAll = useCallback(() => {
        if (!writeContractAsync || !publicClient || !simulatedClaimAll?.request)
            return;
        const create = async () => {
            setClaiming(true);
            try {
                await switchChainAsync({
                    chainId: chainWithRewardsData.chain.id,
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
        chainWithRewardsData.chain.id,
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
                    {chainWithRewardsData.chain.name}
                </Typography>
            </div>
            {chainWithRewardsData.reimbursements.length > 0 && (
                <Button
                    size="xsmall"
                    disabled={simulateRecoverAllErrored || recovered}
                    loading={simulatingRecoverAll || recovering}
                    iconPlacement="right"
                    onClick={handleRecoverAll}
                >
                    {simulatingClaimAll
                        ? t("reimbursements.loading")
                        : recovering
                          ? t("reimbursements.recoveringAll")
                          : t("reimbursements.recoverAll")}
                </Button>
            )}
            <Button
                size="xsmall"
                disabled={simulateClaimAllErrored || claimed}
                loading={simulatingClaimAll || claiming}
                iconPlacement="right"
                onClick={handleClaimAll}
            >
                {simulatingClaimAll
                    ? t("claims.loading")
                    : claiming
                      ? t("claims.claimingAll")
                      : t("claims.claimAll")}
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
