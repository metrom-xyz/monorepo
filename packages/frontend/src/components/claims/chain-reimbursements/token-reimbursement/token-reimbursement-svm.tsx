import { Typography, Button, Card } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { useAccount } from "@/src/hooks/useAccount";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { formatAmount, formatUsdAmount } from "@/src/utils/format";
import { trackUmamiEvent } from "@/src/utils/umami";
import { RemoteLogo } from "@/src/components/remote-logo";
import { RecoverSuccess } from "../../notification/recover-success";
import { RecoverFail } from "../../notification/recover-fail";
import type { TokenReimbursementProps } from ".";
import {
    useLatestBlockhash,
    useSimulateTransaction,
    useSolanaClient,
    useWalletConnection,
} from "@solana/react-hooks";
import { getRecoverRewardInstructionAsync } from "@metrom-xyz/programs-solana";
import { createWalletTransactionSigner } from "@solana/client";
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
import type { SolanaTxMessage } from "@/src/types/solana";
import { useSolanaTransactionSignature } from "@/src/hooks/useSolanaTransactionSignature";

import styles from "./styles.module.css";

export function TokenReimbursementSvm({
    onRecover,
    chainId,
    tokenReimbursements,
    recoveringAll,
}: TokenReimbursementProps) {
    const [recovering, setRecovering] = useState(false);
    const [recovered, setRecovered] = useState(false);
    const [transaction, setTransaction] = useState<SolanaTxMessage>();

    const t = useTranslations("rewards.reimbursements");
    const { address: account } = useAccount();
    const { wallet } = useWalletConnection();
    const client = useSolanaClient();
    const { data: latestBlockhash } = useLatestBlockhash();
    const { waitForConfirmationAsync } = useSolanaTransactionSignature();

    const base64Wire = useMemo(() => {
        if (!transaction) return undefined;
        return getBase64EncodedWireTransaction(compileTransaction(transaction));
    }, [transaction]);

    const {
        data: simulatedRecover,
        isLoading: simulatingRecover,
        isError: simulateRecoverErrored,
        error: simulateRecoverError,
    } = useSimulateTransaction(base64Wire, { config: { encoding: "base64" } });

    const signer = useMemo(
        () =>
            wallet ? createWalletTransactionSigner(wallet).signer : undefined,
        [wallet],
    );

    useEffect(() => {
        if (!signer || !latestBlockhash?.value || !account) return;

        const buildTransaction = async () => {
            const instructions = await Promise.all(
                tokenReimbursements.reimbursements.map(
                    async (reimbursement) => {
                        const receiverTokenAccount = await client
                            .splToken({ mint: reimbursement.token.address })
                            .deriveAssociatedTokenAddress(account);

                        const proof = reimbursement.proof.map((proof) =>
                            getBase16Encoder().encode(proof.slice(2)),
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

            const txMessage = pipe(
                createTransactionMessage({ version: 0 }),
                (tx) => setTransactionMessageFeePayerSigner(signer, tx),
                (tx) =>
                    setTransactionMessageLifetimeUsingBlockhash(
                        latestBlockhash.value,
                        tx,
                    ),
                (tx) => appendTransactionMessageInstructions(instructions, tx),
            );

            setTransaction(txMessage);
        };

        void buildTransaction();
    }, [
        signer,
        account,
        latestBlockhash,
        client,
        tokenReimbursements.reimbursements,
    ]);

    useEffect(() => {
        if (
            !simulatingRecover &&
            simulatedRecover &&
            simulatedRecover.value.err
        )
            console.warn(`Recover simulation failed`, simulatedRecover);
    }, [simulatingRecover, simulatedRecover, simulateRecoverError]);

    const handleStandardRecover = useCallback(() => {
        if (
            !transaction ||
            !simulatedRecover ||
            simulateRecoverErrored ||
            simulatedRecover?.value.err
        )
            return;

        const recover = async () => {
            setRecovering(true);
            try {
                const signedTx =
                    await signTransactionMessageWithSigners(transaction);

                const signature = await client.runtime.rpc
                    .sendTransaction(
                        getBase64EncodedWireTransaction(signedTx),
                        { encoding: "base64" },
                    )
                    .send();

                await waitForConfirmationAsync(signature);

                toast.custom((toastId) => (
                    <RecoverSuccess
                        toastId={toastId}
                        chain={chainId}
                        token={tokenReimbursements.token}
                        amount={tokenReimbursements.totalAmount}
                    />
                ));
                setRecovered(true);
                onRecover();
                trackUmamiEvent("click-recover-single");
            } catch (error) {
                toast.custom((toastId) => <RecoverFail toastId={toastId} />);
                console.warn("Could not recover", error);
            } finally {
                setRecovering(false);
            }
        };

        void recover();
    }, [
        transaction,
        simulatedRecover,
        simulateRecoverErrored,
        client.runtime.rpc,
        waitForConfirmationAsync,
        onRecover,
        chainId,
        tokenReimbursements.token,
        tokenReimbursements.totalAmount,
    ]);

    return (
        <Card className={styles.root}>
            <div className={styles.leftWrapper}>
                <RemoteLogo
                    chain={chainId}
                    address={tokenReimbursements.token.address}
                    defaultText={tokenReimbursements.token.symbol}
                />
                <Typography size="lg" weight="medium">
                    {tokenReimbursements.token.symbol}
                </Typography>
                <div className={styles.amountWrapper}>
                    <Typography size="lg" weight="medium">
                        {formatAmount({
                            amount: tokenReimbursements.totalAmount,
                        })}
                    </Typography>
                    <Typography size="sm" weight="medium" variant="tertiary">
                        {formatUsdAmount({
                            amount:
                                tokenReimbursements.totalAmount *
                                tokenReimbursements.token.usdPrice,
                        })}
                    </Typography>
                </div>
            </div>
            <Button
                variant="secondary"
                size="sm"
                disabled={
                    !simulatedRecover ||
                    simulateRecoverErrored ||
                    !!simulatedRecover?.value.err ||
                    recovered ||
                    recoveringAll
                }
                loading={simulatingRecover || recovering || recoveringAll}
                iconPlacement="right"
                onClick={handleStandardRecover}
            >
                {simulatingRecover
                    ? t("loading")
                    : recovering || recoveringAll
                      ? t("recoveringByToken")
                      : t("recoverByToken")}
            </Button>
        </Card>
    );
}
