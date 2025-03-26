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
import { useCallback, useEffect, useMemo, useState } from "react";
import { trackFathomEvent } from "@/src/utils/fathom";
import { toast } from "sonner";
import { ClaimSuccess } from "../notification/claim-success";
import {
    type WriteContractErrorType,
    type Chain,
    encodeFunctionData,
} from "viem";
import { ClaimFail } from "../notification/claim-fail";
import { RecoverSuccess } from "../notification/recover-success";
import { RecoverFail } from "../notification/recover-fail";
import { SAFE } from "@/src/commons/env";
import { SAFE_APP_SDK } from "@/src/commons";

import styles from "./styles.module.css";

interface ChainOverviewProps {
    className?: string;
    chainWithRewardsData: ChainWithRewardsData;
    onClaimAll: (chain: Chain) => void;
    onRecoverAll: (chain: Chain) => void;
    onClaiming?: (value: boolean) => void;
    onRecovering?: (value: boolean) => void;
}

export function ChainOverview({
    className,
    chainWithRewardsData,
    onClaimAll,
    onRecoverAll,
    onClaiming,
    onRecovering,
}: ChainOverviewProps) {
    const t = useTranslations("rewards");
    const { address: account } = useAccount();
    const publicClient = usePublicClient();
    const { switchChainAsync } = useSwitchChain();
    const { writeContractAsync } = useWriteContract();

    const [claiming, setClaiming] = useState(false);
    const [recovering, setRecovering] = useState(false);

    const ChainIcon = chainWithRewardsData.chainData.icon;

    const recoverRewardsArgs = useMemo(() => {
        if (!account) return [];

        return chainWithRewardsData.reimbursements.map((reimbursement) => {
            return {
                campaignId: reimbursement.campaignId,
                proof: reimbursement.proof,
                token: reimbursement.token.address,
                amount: reimbursement.amount.raw,
                receiver: account,
            };
        });
    }, [account, chainWithRewardsData.reimbursements]);

    const claimRewardsArgs = useMemo(() => {
        if (!account) return [];

        return chainWithRewardsData.claims.map((claim) => {
            return {
                campaignId: claim.campaignId,
                proof: claim.proof,
                token: claim.token.address,
                amount: claim.amount.raw,
                receiver: account,
            };
        });
    }, [account, chainWithRewardsData.claims]);

    const {
        data: simulatedRecoverAll,
        isLoading: simulatingRecoverAll,
        isError: simulateRecoverAllErrored,
    } = useSimulateContract({
        chainId: chainWithRewardsData.chain.id,
        abi: metromAbi,
        address: chainWithRewardsData.chainData.metromContract.address,
        functionName: "recoverRewards",
        args: [recoverRewardsArgs],
        query: {
            refetchOnMount: false,
            enabled:
                !SAFE &&
                !!account &&
                chainWithRewardsData.reimbursements.length > 0,
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
        args: [claimRewardsArgs],
        query: {
            enabled: !SAFE && account && chainWithRewardsData.claims.length > 0,
        },
    });

    useEffect(() => {
        if (onClaiming) onClaiming(claiming);
    }, [claiming, onClaiming]);

    useEffect(() => {
        if (onRecovering) onRecovering(recovering);
    }, [recovering, onRecovering]);

    const handleStandardRecoverAll = useCallback(() => {
        if (
            !writeContractAsync ||
            !publicClient ||
            !simulatedRecoverAll?.request
        )
            return;
        const recover = async () => {
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
                onRecoverAll(chainWithRewardsData.chain);
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
        void recover();
    }, [
        chainWithRewardsData.chain,
        publicClient,
        simulatedRecoverAll,
        onRecoverAll,
        switchChainAsync,
        writeContractAsync,
    ]);

    const handleSafeRecoverAll = useCallback(() => {
        const recover = async () => {
            setRecovering(true);

            try {
                await SAFE_APP_SDK.txs.send({
                    txs: [
                        {
                            to: chainWithRewardsData.chainData.metromContract
                                .address,
                            data: encodeFunctionData({
                                abi: metromAbi,
                                functionName: "recoverRewards",
                                args: [recoverRewardsArgs],
                            }),
                            value: "0",
                        },
                    ],
                });

                // TODO: do we need to check the safe tx status and have a custom notification
                // if the tx gets executed instantly (only 1 signer)?
                toast.custom((toastId) => (
                    <RecoverSuccess toastId={toastId} safe />
                ));
                onRecoverAll(chainWithRewardsData.chain);
                trackFathomEvent("CLICK_RECOVER_ALL");
            } catch (error) {
                console.warn("Could not recover", error);
            } finally {
                setRecovering(false);
            }
        };

        void recover();
    }, [
        recoverRewardsArgs,
        chainWithRewardsData.chainData,
        chainWithRewardsData.chain,
        onRecoverAll,
    ]);

    const handleStandardClaimAll = useCallback(() => {
        if (!writeContractAsync || !publicClient || !simulatedClaimAll?.request)
            return;
        const claim = async () => {
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
                onClaimAll(chainWithRewardsData.chain);
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
                            message={t("claims.notification.fail.message")}
                        />
                    ));

                console.warn("Could not claim", error);
            } finally {
                setClaiming(false);
            }
        };
        void claim();
    }, [
        t,
        chainWithRewardsData.chain,
        publicClient,
        simulatedClaimAll,
        onClaimAll,
        switchChainAsync,
        writeContractAsync,
    ]);

    const handleSafeClaimAll = useCallback(() => {
        const claim = async () => {
            setClaiming(true);

            try {
                await SAFE_APP_SDK.txs.send({
                    txs: [
                        {
                            to: chainWithRewardsData.chainData.metromContract
                                .address,
                            data: encodeFunctionData({
                                abi: metromAbi,
                                functionName: "claimRewards",
                                args: [claimRewardsArgs],
                            }),
                            value: "0",
                        },
                    ],
                });

                toast.custom((toastId) => (
                    <ClaimSuccess toastId={toastId} safe />
                ));
                onClaimAll(chainWithRewardsData.chain);
                trackFathomEvent("CLICK_CLAIM_ALL");
            } catch (error) {
                console.warn("Could not claim", error);
            } finally {
                setClaiming(false);
            }
        };

        void claim();
    }, [
        claimRewardsArgs,
        chainWithRewardsData.chainData,
        chainWithRewardsData.chain,
        onClaimAll,
    ]);

    return (
        <Card className={classNames(styles.root, className)}>
            <div className={styles.chainNameWrapper}>
                <ChainIcon className={styles.chainIcon} />
                <Typography size="xl4" truncate>
                    {chainWithRewardsData.chain.name}
                </Typography>
            </div>
            <div className={styles.buttonsWrapper}>
                {chainWithRewardsData.reimbursements.length > 0 && (
                    <Button
                        size="sm"
                        disabled={simulateRecoverAllErrored}
                        loading={simulatingRecoverAll || recovering}
                        iconPlacement="right"
                        onClick={
                            SAFE
                                ? handleSafeRecoverAll
                                : handleStandardRecoverAll
                        }
                    >
                        {simulatingRecoverAll
                            ? t("reimbursements.loading")
                            : recovering
                              ? t("reimbursements.recoveringAll")
                              : t("reimbursements.recoverAll")}
                    </Button>
                )}
                {chainWithRewardsData.claims.length > 0 && (
                    <Button
                        size="sm"
                        disabled={simulateClaimAllErrored}
                        loading={simulatingClaimAll || claiming}
                        iconPlacement="right"
                        onClick={
                            SAFE ? handleSafeClaimAll : handleStandardClaimAll
                        }
                    >
                        {simulatingClaimAll
                            ? t("claims.loading")
                            : claiming
                              ? t("claims.claimingAll")
                              : t("claims.claimAll")}
                    </Button>
                )}
            </div>
        </Card>
    );
}

export function SkeletonChainOverview() {
    const t = useTranslations("rewards");

    return (
        <Card className={styles.root}>
            <div className={styles.chainNameWrapper}>
                <Skeleton className={styles.chainIcon} />
                <Skeleton width={100} size="xl4" />
            </div>
            <Button size="sm" loading>
                {t("claims.loading")}
            </Button>
        </Card>
    );
}
