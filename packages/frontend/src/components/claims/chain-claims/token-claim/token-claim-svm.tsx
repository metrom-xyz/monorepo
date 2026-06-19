import { Typography, Button, Card } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { useAccount } from "@/src/hooks/useAccount";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { formatAmount, formatUsdAmount } from "@/src/utils/format";
import { trackUmamiEvent } from "@/src/utils/umami";
import { RemoteLogo } from "@/src/components/remote-logo";
import { ClaimSuccess } from "../../notification/claim-success";
import { ClaimFail } from "../../notification/claim-fail";
import type { TokenClaimProps } from ".";
import {
    useLatestBlockhash,
    useSimulateTransaction,
    useSolanaClient,
    useWalletConnection,
} from "@solana/react-hooks";
import { getClaimRewardInstructionAsync } from "@metrom-xyz/programs-solana";
import { createWalletTransactionSigner } from "@solana/client";
import {
    compileTransaction,
    getBase16Encoder,
    getBase64EncodedWireTransaction,
    signTransactionMessageWithSigners,
    type Address,
} from "@solana/kit";
import type { SolanaTxMessage } from "@/src/types/solana";
import { useSolanaTransactionSignature } from "@/src/hooks/useSolanaTransactionSignature";
import { buildSolanaTransactionBatches } from "@/src/utils/solana";

import styles from "./styles.module.css";

export function TokenClaimSvm({
    onClaim,
    chainId,
    tokenClaims,
    claimingAll,
}: TokenClaimProps) {
    const [claiming, setClaiming] = useState(false);
    const [claimed, setClaimed] = useState(false);
    const [transactions, setTransactions] = useState<SolanaTxMessage[]>();

    const t = useTranslations("rewards.claims");
    const { address: account } = useAccount();
    const { wallet } = useWalletConnection();
    const client = useSolanaClient();
    const { data: latestBlockhash } = useLatestBlockhash();
    const { waitForConfirmationAsync } = useSolanaTransactionSignature();

    const base64Wire = useMemo(() => {
        if (!transactions || transactions.length === 0) return undefined;
        return getBase64EncodedWireTransaction(
            compileTransaction(transactions[0]),
        );
    }, [transactions]);

    const {
        data: simulatedClaim,
        isLoading: simulatingClaim,
        isError: simulateClaimErrored,
        error: simulateClaimError,
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
                tokenClaims.claims.map(async (claim) => {
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

            const claimBatches = buildSolanaTransactionBatches({
                signer,
                blockHash: latestBlockhash.value,
                instructions,
            });

            setTransactions(claimBatches);
        };

        void buildTransaction();
    }, [signer, account, latestBlockhash, client, tokenClaims.claims]);

    useEffect(() => {
        if (!simulatingClaim && simulatedClaim && simulatedClaim.value.err)
            console.warn(
                `Claim simulation failed`,
                simulatedClaim,
                simulateClaimError,
            );
    }, [simulatingClaim, simulatedClaim, simulateClaimError]);

    const handleStandardClaim = useCallback(() => {
        if (
            !transactions?.length ||
            !simulatedClaim ||
            simulateClaimErrored ||
            simulatedClaim?.value.err
        )
            return;

        const claim = async () => {
            setClaiming(true);
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
                    <ClaimSuccess
                        toastId={toastId}
                        chain={chainId}
                        token={tokenClaims.token}
                        amount={tokenClaims.totalAmount}
                    />
                ));
                setClaimed(true);
                onClaim(tokenClaims.token);
                trackUmamiEvent("click-claim-single");
            } catch (error) {
                toast.custom((toastId) => <ClaimFail toastId={toastId} />);
                console.warn("Could not claim", error);
            } finally {
                setClaiming(false);
            }
        };

        void claim();
    }, [
        transactions,
        simulatedClaim,
        simulateClaimErrored,
        client.runtime.rpc,
        waitForConfirmationAsync,
        onClaim,
        chainId,
        tokenClaims.token,
        tokenClaims.totalAmount,
    ]);

    return (
        <Card className={styles.root}>
            <div className={styles.leftWrapper}>
                <RemoteLogo
                    chain={chainId}
                    address={tokenClaims.token.address}
                    defaultText={tokenClaims.token.symbol}
                />
                <Typography size="lg" weight="medium">
                    {tokenClaims.token.symbol}
                </Typography>
                <div className={styles.amountWrapper}>
                    <Typography size="lg" weight="medium">
                        {formatAmount({
                            amount: tokenClaims.totalAmount,
                        })}
                    </Typography>
                    <Typography size="sm" weight="medium" variant="tertiary">
                        {formatUsdAmount({
                            amount:
                                tokenClaims.totalAmount *
                                tokenClaims.token.usdPrice,
                        })}
                    </Typography>
                </div>
            </div>
            <Button
                variant="secondary"
                size="sm"
                disabled={
                    !transactions?.length ||
                    !simulatedClaim ||
                    simulateClaimErrored ||
                    !!simulatedClaim?.value.err ||
                    claimed ||
                    claimingAll
                }
                loading={simulatingClaim || claiming || claimingAll}
                iconPlacement="right"
                onClick={handleStandardClaim}
            >
                {simulatingClaim
                    ? t("loading")
                    : claiming || claimingAll
                      ? t("claimingByToken")
                      : t("claimByToken")}
            </Button>
        </Card>
    );
}
