import classNames from "classnames";
import { Typography, Button, Card } from "@metrom-xyz/ui";
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
import type { SolanaTxMessage } from "@/src/types/solana";
import {
    appendTransactionMessageInstructions,
    compileTransaction,
    createTransactionMessage,
    getBase16Encoder,
    getBase64EncodedWireTransaction,
    pipe,
    setTransactionMessageFeePayerSigner,
    setTransactionMessageLifetimeUsingBlockhash,
    signTransactionMessageWithSigners,
    type Address,
} from "@solana/kit";
import {
    useLatestBlockhash,
    useSimulateTransaction,
    useSolanaClient,
    useWalletConnection,
} from "@solana/react-hooks";
import { createWalletTransactionSigner } from "@solana/client";
import {
    getClaimRewardInstructionAsync,
    getRecoverRewardInstructionAsync,
} from "@metrom-xyz/programs-solana";
import { useSolanaTransactionSignature } from "@/src/hooks/useSolanaTransactionSignature";

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
    const [recoverAllTransaction, setRecoverAllTransaction] =
        useState<SolanaTxMessage>();
    const [claimAllTransaction, setClaimAllTransaction] =
        useState<SolanaTxMessage>();

    const t = useTranslations("rewards");
    const { address: account } = useAccount();
    const { wallet } = useWalletConnection();
    const client = useSolanaClient();
    const { data: latestBlockhash } = useLatestBlockhash();
    const { waitForConfirmationAsync } = useSolanaTransactionSignature();

    const ChainIcon = chainWithRewardsData.chainData.icon;

    const recoverAllBase64Wire = useMemo(() => {
        if (!recoverAllTransaction) return undefined;
        return getBase64EncodedWireTransaction(
            compileTransaction(recoverAllTransaction),
        );
    }, [recoverAllTransaction]);

    const claimAllBase64Wire = useMemo(() => {
        if (!claimAllTransaction) return undefined;
        return getBase64EncodedWireTransaction(
            compileTransaction(claimAllTransaction),
        );
    }, [claimAllTransaction]);

    const {
        data: simulatedRecoverAll,
        isLoading: simulatingRecoverAll,
        isError: simulatedRecoverAllErrored,
    } = useSimulateTransaction(recoverAllBase64Wire, {
        config: { encoding: "base64" },
    });

    const {
        data: simulatedClaimAll,
        isLoading: simulatingClaimAll,
        isError: simulatedClaimAllErrored,
    } = useSimulateTransaction(claimAllBase64Wire, {
        config: { encoding: "base64" },
    });

    const signer = useMemo(
        () =>
            wallet ? createWalletTransactionSigner(wallet).signer : undefined,
        [wallet],
    );

    useEffect(() => {
        if (!signer || !latestBlockhash?.value || !account) return;

        const buildTransaction = async () => {
            const recoverInstructions = await Promise.all(
                chainWithRewardsData.reimbursements.map(
                    async (reimbursement) => {
                        const receiverTokenAccount = await client
                            .splToken({ mint: reimbursement.token.address })
                            .deriveAssociatedTokenAddress(account);

                        const proof = reimbursement.proof.map((proof) =>
                            getBase16Encoder().encode(proof),
                        );

                        return await getRecoverRewardInstructionAsync({
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

            const claimInstructions = await Promise.all(
                chainWithRewardsData.claims.map(async (claim) => {
                    const receiverTokenAccount = await client
                        .splToken({ mint: claim.token.address })
                        .deriveAssociatedTokenAddress(account);

                    const proof = claim.proof.map((proof) =>
                        getBase16Encoder().encode(proof),
                    );

                    return await getClaimRewardInstructionAsync({
                        amount: claim.amount.raw,
                        proof,
                        mint: claim.token.address as Address,
                        campaign: claim.campaignId as Address,
                        receiverTokenAccount,
                        signer,
                    });
                }),
            );

            const recoverTxMessage = pipe(
                createTransactionMessage({ version: 0 }),
                (tx) => setTransactionMessageFeePayerSigner(signer, tx),
                (tx) =>
                    setTransactionMessageLifetimeUsingBlockhash(
                        latestBlockhash.value,
                        tx,
                    ),
                (tx) =>
                    appendTransactionMessageInstructions(
                        recoverInstructions,
                        tx,
                    ),
            );

            const claimTxMessage = pipe(
                createTransactionMessage({ version: 0 }),
                (tx) => setTransactionMessageFeePayerSigner(signer, tx),
                (tx) =>
                    setTransactionMessageLifetimeUsingBlockhash(
                        latestBlockhash.value,
                        tx,
                    ),
                (tx) =>
                    appendTransactionMessageInstructions(claimInstructions, tx),
            );

            setRecoverAllTransaction(recoverTxMessage);
            setClaimAllTransaction(claimTxMessage);
        };

        void buildTransaction();
    }, [signer, account, latestBlockhash, client, chainWithRewardsData]);

    useEffect(() => {
        if (onClaiming) onClaiming(claiming);
    }, [claiming, onClaiming]);

    useEffect(() => {
        if (onRecovering) onRecovering(recovering);
    }, [recovering, onRecovering]);

    const handleStandardRecoverAll = useCallback(() => {
        if (
            !recoverAllTransaction ||
            !simulatedRecoverAll ||
            simulatedRecoverAllErrored ||
            simulatedRecoverAll?.value.err
        )
            return;

        const recover = async () => {
            setRecovering(true);
            try {
                const signedTx = await signTransactionMessageWithSigners(
                    recoverAllTransaction,
                );
                const signature = await client.runtime.rpc
                    .sendTransaction(
                        getBase64EncodedWireTransaction(signedTx),
                        { encoding: "base64" },
                    )
                    .send();

                await waitForConfirmationAsync(signature);

                toast.custom((toastId) => <RecoverSuccess toastId={toastId} />);
                onRecoverAll();
                trackUmamiEvent("click-recover-all");
            } catch (error) {
                toast.custom((toastId) => <RecoverFail toastId={toastId} />);
                console.warn("Could not recover", error);
            } finally {
                setRecovering(false);
            }
        };
        void recover();
    }, [
        recoverAllTransaction,
        simulatedRecoverAll,
        simulatedRecoverAllErrored,
        client.runtime.rpc,
        onRecoverAll,
        waitForConfirmationAsync,
    ]);

    const handleStandardClaimAll = useCallback(() => {
        if (
            !claimAllTransaction ||
            !simulatedClaimAll ||
            simulatedClaimAllErrored ||
            !simulatedClaimAll?.value.err
        )
            return;

        const claim = async () => {
            setClaiming(true);
            try {
                const signedTx =
                    await signTransactionMessageWithSigners(
                        claimAllTransaction,
                    );
                const signature = await client.runtime.rpc
                    .sendTransaction(
                        getBase64EncodedWireTransaction(signedTx),
                        { encoding: "base64" },
                    )
                    .send();

                await waitForConfirmationAsync(signature);

                toast.custom((toastId) => <ClaimSuccess toastId={toastId} />);
                onClaimAll();
                trackUmamiEvent("click-claim-all");
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
        simulatedClaimAllErrored,
        simulatedClaimAll,
        client.runtime.rpc,
        claimAllTransaction,
        onClaimAll,
        waitForConfirmationAsync,
    ]);

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
                    <Button
                        size="sm"
                        disabled={
                            !simulatedRecoverAll ||
                            simulatedRecoverAllErrored ||
                            !!simulatedRecoverAll?.value.err
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
                )}
                {chainWithRewardsData.claims.length > 0 && (
                    <Button
                        size="sm"
                        disabled={
                            !simulatedClaimAll ||
                            simulatedClaimAllErrored ||
                            !!simulatedClaimAll?.value.err
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
                )}
            </div>
        </Card>
    );
}
