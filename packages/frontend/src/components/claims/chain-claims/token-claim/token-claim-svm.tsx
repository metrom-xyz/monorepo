import { Typography, Button, Card, Popover } from "@metrom-xyz/ui";
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
import { getBase16Encoder, type Address, type Instruction } from "@solana/kit";
import { useSimulateSolanaTransactions } from "@/src/hooks/useSimulateSolanaTransactions";
import { useExecuteSolanaTransactionPlan } from "@/src/hooks/useExecuteSolanaTransactionPlan";

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
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);

    const t = useTranslations("rewards.claims");
    const { address: account } = useAccount();
    const { wallet } = useWalletConnection();
    const client = useSolanaClient();
    const { data: latestBlockhash } = useLatestBlockhash();
    const { execute } = useExecuteSolanaTransactionPlan();

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
        instructionPlan,
        transactionCount,
        simulating: simulatingClaim,
        errored: simulateClaimErrored,
    } = useSimulateSolanaTransactions({
        instructions,
        signer,
        blockHash: latestBlockhash?.value,
    });

    const handleStandardClaim = useCallback(() => {
        if (!instructionPlan || simulateClaimErrored || !signer) return;

        const claim = async () => {
            setClaiming(true);
            try {
                const summary = await execute({ instructionPlan, signer });

                if (summary.successful) {
                    toast.custom((toastId) => (
                        <ClaimSuccess
                            toastId={toastId}
                            chain={chainId}
                            token={tokenClaims.token}
                            amount={tokenClaims.totalAmount}
                        />
                    ));
                    setClaimed(true);
                    onClaim();
                    trackUmamiEvent("click-claim-single");
                } else if (summary.successfulTransactions.length > 0) {
                    const failed =
                        summary.failedTransactions.length +
                        summary.canceledTransactions.length;
                    toast.custom((toastId) => (
                        <ClaimFail
                            toastId={toastId}
                            message={t("notification.partial.message", {
                                succeeded:
                                    summary.successfulTransactions.length,
                                failed,
                                total:
                                    summary.successfulTransactions.length +
                                    failed,
                            })}
                        />
                    ));
                    onClaim();
                } else {
                    toast.custom((toastId) => <ClaimFail toastId={toastId} />);
                }
            } catch (error) {
                toast.custom((toastId) => <ClaimFail toastId={toastId} />);
                console.warn("Could not claim", error);
            } finally {
                setClaiming(false);
            }
        };

        void claim();
    }, [
        instructionPlan,
        simulateClaimErrored,
        signer,
        execute,
        onClaim,
        chainId,
        tokenClaims.token,
        tokenClaims.totalAmount,
        t,
    ]);

    function handlePopoverOpen() {
        setPopoverOpen(true);
    }

    function handlePopoverClose() {
        setPopoverOpen(false);
    }

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
            <div
                ref={setAnchor}
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
            >
                {transactionCount > 1 && (
                    <Popover
                        placement="top"
                        anchor={anchor}
                        open={popoverOpen}
                        onOpenChange={setPopoverOpen}
                        className={styles.popover}
                    >
                        <Typography size="sm">
                            {t("multipleTransactions", {
                                count: transactionCount,
                            })}
                        </Typography>
                    </Popover>
                )}
                <Button
                    variant="secondary"
                    size="sm"
                    disabled={
                        !instructionPlan ||
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
            </div>
        </Card>
    );
}
