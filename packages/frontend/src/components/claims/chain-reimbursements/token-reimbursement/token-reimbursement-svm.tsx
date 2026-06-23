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
    useSolanaClient,
    useWalletConnection,
} from "@solana/react-hooks";
import { getRecoverRewardInstructionAsync } from "@metrom-xyz/programs-solana";
import { createWalletTransactionSigner } from "@solana/client";
import {
    getBase16Encoder,
    getBase64EncodedWireTransaction,
    signTransactionMessageWithSigners,
    type Address,
    type Instruction,
} from "@solana/kit";
import { useSolanaTransactionSignature } from "@/src/hooks/useSolanaTransactionSignature";
import { useSimulateSolanaTransactions } from "@/src/hooks/useSimulateSolanaTransactions";

import styles from "./styles.module.css";

export function TokenReimbursementSvm({
    onRecover,
    chainId,
    tokenReimbursements,
    recoveringAll,
}: TokenReimbursementProps) {
    const [recovering, setRecovering] = useState(false);
    const [recovered, setRecovered] = useState(false);
    const [instructions, setInstructions] = useState<Instruction[]>();

    const t = useTranslations("rewards.reimbursements");
    const { address: account } = useAccount();
    const { wallet } = useWalletConnection();
    const client = useSolanaClient();
    const { data: latestBlockhash } = useLatestBlockhash();
    const { waitForConfirmationAsync } = useSolanaTransactionSignature();

    const signer = useMemo(
        () =>
            wallet ? createWalletTransactionSigner(wallet).signer : undefined,
        [wallet],
    );

    useEffect(() => {
        if (!signer || !account) return;

        let cancelled = false;

        const buildInstructions = async () => {
            setInstructions(undefined);

            try {
                const built = await Promise.all(
                    tokenReimbursements.reimbursements.map(
                        async (reimbursement) => {
                            const receiverTokenAccount = await client
                                .splToken({ mint: reimbursement.token.address })
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

                if (!cancelled) setInstructions(built);
            } catch (error) {
                console.warn("Error building recover instructions", error);
            }
        };

        void buildInstructions();
        return () => {
            cancelled = true;
        };
    }, [signer, account, client, tokenReimbursements.reimbursements]);

    const {
        transactions,
        simulating: simulatingRecover,
        errored: simulateRecoverErrored,
    } = useSimulateSolanaTransactions({
        instructions,
        signer,
        blockHash: latestBlockhash?.value,
    });

    const handleStandardRecover = useCallback(() => {
        if (!transactions?.length || simulateRecoverErrored) return;

        const recover = async () => {
            setRecovering(true);
            try {
                for (const transaction of transactions) {
                    const signedTransaction =
                        await signTransactionMessageWithSigners(transaction);

                    const signature = await client.runtime.rpc
                        .sendTransaction(
                            getBase64EncodedWireTransaction(signedTransaction),
                            { encoding: "base64" },
                        )
                        .send();

                    await waitForConfirmationAsync(signature);
                }

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
        transactions,
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
                    !transactions?.length ||
                    simulateRecoverErrored ||
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
