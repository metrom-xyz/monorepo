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
    useSolanaClient,
    useWalletConnection,
} from "@solana/react-hooks";
import { getClaimRewardInstructionAsync } from "@metrom-xyz/programs-solana";
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

export function TokenClaimSvm({
    onClaim,
    chainId,
    tokenClaims,
    claimingAll,
}: TokenClaimProps) {
    const [claiming, setClaiming] = useState(false);
    const [claimed, setClaimed] = useState(false);
    const [instructions, setInstructions] = useState<Instruction[]>();

    const t = useTranslations("rewards.claims");
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

                if (!cancelled) setInstructions(built);
            } catch (error) {
                console.warn("Error building claim instructions", error);
            }
        };

        void buildInstructions();
        return () => {
            cancelled = true;
        };
    }, [signer, account, client, tokenClaims.claims]);

    const {
        transactions,
        simulating: simulatingClaim,
        errored: simulateClaimErrored,
    } = useSimulateSolanaTransactions({
        instructions,
        signer,
        blockHash: latestBlockhash?.value,
    });

    const handleStandardClaim = useCallback(() => {
        if (!transactions?.length || simulateClaimErrored) return;

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
                    simulateClaimErrored ||
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
