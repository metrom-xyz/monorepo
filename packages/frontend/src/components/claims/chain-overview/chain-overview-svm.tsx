import classNames from "classnames";
import { Typography, Button, Card, Popover } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { useAccount } from "@/src/hooks/useAccount";
import { useCallback, useEffect, useMemo, useState } from "react";
import { trackUmamiEvent } from "@/src/utils/umami";
import { toast } from "sonner";
import { ClaimSuccess } from "../notification/claim-success";
import { ClaimFail } from "../notification/claim-fail";
import { RecoverSuccess } from "../notification/recover-success";
import { RecoverFail } from "../notification/recover-fail";
import { formatUsdAmount } from "@/src/utils/format";
import type { ChainOverviewProps } from ".";
import { getBase16Encoder, type Address, type Instruction } from "@solana/kit";
import {
    useLatestBlockhash,
    useSolanaClient,
    useWalletConnection,
} from "@solana/react-hooks";
import { createWalletTransactionSigner } from "@solana/client";
import {
    getClaimRewardInstructionAsync,
    getRecoverRewardInstructionAsync,
} from "@metrom-xyz/programs-solana";
import { useSimulateSolanaTransactions } from "@/src/hooks/useSimulateSolanaTransactions";
import { useExecuteSolanaTransactionPlan } from "@/src/hooks/useExecuteSolanaTransactionPlan";

import styles from "./styles.module.css";

export function ChainOverviewSvm({
    className,
    chainWithRewardsData,
    onClaimAll,
    onRecoverAll,
    onClaiming,
    onRecovering,
}: ChainOverviewProps) {
    const [claiming, setClaiming] = useState(false);
    const [recovering, setRecovering] = useState(false);
    const [recoverInstructions, setRecoverInstructions] =
        useState<Instruction[]>();
    const [claimInstructions, setClaimInstructions] = useState<Instruction[]>();
    const [recoverAllPopoverOpen, setRecoverAllPopoverOpen] = useState(false);
    const [recoverAllAnchor, setRecoverAllAnchor] =
        useState<HTMLDivElement | null>(null);
    const [claimAllPopoverOpen, setClaimAllPopoverOpen] = useState(false);
    const [claimAllAnchor, setClaimAllAnchor] = useState<HTMLDivElement | null>(
        null,
    );

    const t = useTranslations("rewards");
    const { address: account } = useAccount();
    const { wallet } = useWalletConnection();
    const client = useSolanaClient();
    const { data: latestBlockhash } = useLatestBlockhash();
    const { execute } = useExecuteSolanaTransactionPlan();

    const ChainIcon = chainWithRewardsData.chainData.icon;

    const signer = useMemo(
        () =>
            wallet ? createWalletTransactionSigner(wallet).signer : undefined,
        [wallet],
    );

    useEffect(() => {
        if (!signer || !account) return;

        let cancelled = false;

        const buildRecoverInstructions = async () => {
            setRecoverInstructions(undefined);

            try {
                const built = await Promise.all(
                    chainWithRewardsData.reimbursements.map(
                        async (reimbursement) => {
                            const receiverTokenAccount = await client
                                .splToken({
                                    mint: reimbursement.token.address,
                                })
                                .deriveAssociatedTokenAddress(account);

                            const proof = reimbursement.proof.map((proof) =>
                                getBase16Encoder().encode(proof.slice(2)),
                            );

                            return getRecoverRewardInstructionAsync({
                                amount: reimbursement.amount.raw,
                                proof,
                                mint: reimbursement.token.address as Address,
                                campaign: reimbursement.campaignId as Address,
                                receiverTokenAccount,
                                signer,
                            });
                        },
                    ),
                );

                if (!cancelled) setRecoverInstructions(built);
            } catch (error) {
                console.warn("Error building recover instructions", error);
            }
        };

        void buildRecoverInstructions();
        return () => {
            cancelled = true;
        };
    }, [signer, account, client, chainWithRewardsData.reimbursements]);

    useEffect(() => {
        if (!signer || !account) return;

        let cancelled = false;

        const buildClaimInstructions = async () => {
            setClaimInstructions(undefined);
            try {
                const built = await Promise.all(
                    chainWithRewardsData.claims.map(async (claim) => {
                        const receiverTokenAccount = await client
                            .splToken({ mint: claim.token.address })
                            .deriveAssociatedTokenAddress(account);

                        const proof = claim.proof.map((proof) =>
                            getBase16Encoder().encode(proof.slice(2)),
                        );

                        return getClaimRewardInstructionAsync({
                            amount: claim.amount.raw,
                            proof,
                            mint: claim.token.address as Address,
                            campaign: claim.campaignId as Address,
                            receiverTokenAccount,
                            signer,
                        });
                    }),
                );
                if (!cancelled) setClaimInstructions(built);
            } catch (error) {
                console.warn("Error building claim instructions", error);
            }
        };

        void buildClaimInstructions();
        return () => {
            cancelled = true;
        };
    }, [signer, account, client, chainWithRewardsData.claims]);

    const {
        instructionPlan: recoverInstructionPlan,
        transactionCount: recoverAllTransactionCount,
        simulating: simulatingRecoverAll,
        errored: simulateRecoverAllErrored,
    } = useSimulateSolanaTransactions({
        instructions: recoverInstructions,
        signer,
        blockHash: latestBlockhash?.value,
        enabled: chainWithRewardsData.reimbursements.length > 0,
    });

    const {
        instructionPlan: claimInstructionPlan,
        transactionCount: claimAllTransactionCount,
        simulating: simulatingClaimAll,
        errored: simulateClaimAllErrored,
    } = useSimulateSolanaTransactions({
        instructions: claimInstructions,
        signer,
        blockHash: latestBlockhash?.value,
        enabled: chainWithRewardsData.claims.length > 0,
    });

    useEffect(() => {
        if (onClaiming) onClaiming(claiming);
    }, [claiming, onClaiming]);

    useEffect(() => {
        if (onRecovering) onRecovering(recovering);
    }, [recovering, onRecovering]);

    function handleRecoverAllPopoverOpen() {
        setRecoverAllPopoverOpen(true);
    }

    function handleRecoverAllPopoverClose() {
        setRecoverAllPopoverOpen(false);
    }

    function handleClaimAllPopoverOpen() {
        setClaimAllPopoverOpen(true);
    }

    function handleClaimAllPopoverClose() {
        setClaimAllPopoverOpen(false);
    }

    const handleStandardRecoverAll = useCallback(() => {
        if (!recoverInstructionPlan || simulateRecoverAllErrored || !signer)
            return;

        const recover = async () => {
            setRecovering(true);
            try {
                const summary = await execute({
                    instructionPlan: recoverInstructionPlan,
                    signer,
                });

                if (summary.successful) {
                    toast.custom((toastId) => (
                        <RecoverSuccess toastId={toastId} />
                    ));
                    onRecoverAll();
                    trackUmamiEvent("click-recover-all");
                } else if (summary.successfulTransactions.length > 0) {
                    const failed =
                        summary.failedTransactions.length +
                        summary.canceledTransactions.length;
                    toast.custom((toastId) => (
                        <RecoverFail
                            toastId={toastId}
                            message={t(
                                "reimbursements.notification.partial.message",
                                {
                                    succeeded:
                                        summary.successfulTransactions.length,
                                    failed,
                                    total:
                                        summary.successfulTransactions.length +
                                        failed,
                                },
                            )}
                        />
                    ));
                    onRecoverAll();
                } else {
                    toast.custom((toastId) => (
                        <RecoverFail toastId={toastId} />
                    ));
                }
            } catch (error) {
                toast.custom((toastId) => <RecoverFail toastId={toastId} />);
                console.warn("Could not recover", error);
            } finally {
                setRecovering(false);
            }
        };
        void recover();
    }, [
        recoverInstructionPlan,
        simulateRecoverAllErrored,
        signer,
        execute,
        onRecoverAll,
        t,
    ]);

    const handleStandardClaimAll = useCallback(() => {
        if (!claimInstructionPlan || simulateClaimAllErrored || !signer) return;

        const claim = async () => {
            setClaiming(true);
            try {
                const summary = await execute({
                    instructionPlan: claimInstructionPlan,
                    signer,
                });

                if (summary.successful) {
                    toast.custom((toastId) => (
                        <ClaimSuccess toastId={toastId} />
                    ));
                    onClaimAll();
                    trackUmamiEvent("click-claim-all");
                } else if (summary.successfulTransactions.length > 0) {
                    const failed =
                        summary.failedTransactions.length +
                        summary.canceledTransactions.length;

                    toast.custom((toastId) => (
                        <ClaimFail
                            toastId={toastId}
                            message={t("claims.notification.partial.message", {
                                succeeded:
                                    summary.successfulTransactions.length,
                                failed,
                                total:
                                    summary.successfulTransactions.length +
                                    failed,
                            })}
                        />
                    ));
                    onClaimAll();
                } else {
                    toast.custom((toastId) => (
                        <ClaimFail
                            toastId={toastId}
                            message={t("claims.notification.fail.message")}
                        />
                    ));
                }
            } catch (error) {
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
        simulateClaimAllErrored,
        signer,
        claimInstructionPlan,
        execute,
        onClaimAll,
    ]);

    const multipleRecoveries = recoverAllTransactionCount > 1;
    const multipleClaims = claimAllTransactionCount > 1;

    return (
        <Card className={classNames(styles.root, className)}>
            <div className={styles.chainNameWrapper}>
                <ChainIcon className={styles.chainIcon} />
                <Typography size="xl3" truncate>
                    {chainWithRewardsData.chainData.name}
                </Typography>
                <Typography size="xl2" weight="medium" variant="tertiary">
                    {formatUsdAmount({
                        amount: chainWithRewardsData.totalUsdValue,
                    })}
                </Typography>
            </div>
            <div className={styles.buttonsWrapper}>
                {chainWithRewardsData.reimbursements.length > 0 && (
                    <div
                        ref={setRecoverAllAnchor}
                        onMouseEnter={handleRecoverAllPopoverOpen}
                        onMouseLeave={handleRecoverAllPopoverClose}
                    >
                        {multipleRecoveries && (
                            <Popover
                                placement="top"
                                anchor={recoverAllAnchor}
                                open={recoverAllPopoverOpen}
                                onOpenChange={setRecoverAllPopoverOpen}
                                className={styles.popover}
                            >
                                <Typography size="sm">
                                    {t("reimbursements.multipleTransactions", {
                                        count: recoverAllTransactionCount,
                                    })}
                                </Typography>
                            </Popover>
                        )}
                        <Button
                            size="sm"
                            disabled={
                                !recoverInstructionPlan ||
                                simulateRecoverAllErrored
                            }
                            loading={simulatingRecoverAll || recovering}
                            iconPlacement="right"
                            onClick={handleStandardRecoverAll}
                        >
                            {simulatingRecoverAll
                                ? t("reimbursements.loading")
                                : recovering
                                  ? t("reimbursements.recoveringAll")
                                  : t("reimbursements.recoverAll")}
                        </Button>
                    </div>
                )}
                {chainWithRewardsData.claims.length > 0 && (
                    <div
                        ref={setClaimAllAnchor}
                        onMouseEnter={handleClaimAllPopoverOpen}
                        onMouseLeave={handleClaimAllPopoverClose}
                    >
                        {multipleClaims && (
                            <Popover
                                placement="top"
                                anchor={claimAllAnchor}
                                open={claimAllPopoverOpen}
                                onOpenChange={setClaimAllPopoverOpen}
                                className={styles.popover}
                            >
                                <Typography size="sm">
                                    {t("claims.multipleTransactions", {
                                        count: claimAllTransactionCount,
                                    })}
                                </Typography>
                            </Popover>
                        )}
                        <Button
                            size="sm"
                            disabled={
                                !claimInstructionPlan || simulateClaimAllErrored
                            }
                            loading={simulatingClaimAll || claiming}
                            iconPlacement="right"
                            onClick={handleStandardClaimAll}
                        >
                            {simulatingClaimAll
                                ? t("claims.loading")
                                : claiming
                                  ? t("claims.claimingAll")
                                  : t("claims.claimAll")}
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    );
}
