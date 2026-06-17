"use client";

import { Typography, Button, Card } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { formatAmount, formatUsdAmount } from "@/src/utils/format";
import { trackUmamiEvent } from "@/src/utils/umami";
import { RemoteLogo } from "@/src/components/remote-logo";
import { RecoverSuccess } from "../../notification/recover-success";
import { RecoverFail } from "../../notification/recover-fail";
import { useChainData } from "@/src/hooks/useChainData";
import type { TokenReimbursementProps } from ".";
import {
    useCurrentAccount,
    useCurrentClient,
    useDAppKit,
} from "@mysten/dapp-kit-react";
import { Transaction } from "@mysten/sui/transactions";
import { recoverRewards } from "@metrom-xyz/sui-contracts/client";
import { fromHex } from "@mysten/sui/utils";

import styles from "./styles.module.css";

export function TokenReimbursementSui({
    onRecover,
    chainId,
    tokenReimbursements,
    recoveringAll,
}: TokenReimbursementProps) {
    const [recovering, setRecovering] = useState(false);
    const [recovered, setRecovered] = useState(false);
    const [loading, setLoading] = useState(false);
    const [transaction, setTransaction] = useState<Transaction>();

    const t = useTranslations("rewards.reimbursements");
    const chainData = useChainData({ chainId });
    const account = useCurrentAccount();
    const client = useCurrentClient();
    const dAppKit = useDAppKit();

    useEffect(() => {
        const build = async () => {
            setTransaction(undefined);

            if (
                !chainData ||
                !account ||
                !chainData.metromContract.stateAddress
            )
                return;

            const tx = new Transaction();
            tx.setSender(account.address);

            for (const reimbursement of tokenReimbursements.reimbursements) {
                recoverRewards({
                    package: chainData.metromContract.address,
                    typeArguments: [reimbursement.token.address],
                    arguments: {
                        state: chainData.metromContract.stateAddress,
                        campaignId: Array.from(
                            fromHex(reimbursement.campaignId),
                        ),
                        proof: reimbursement.proof.map((proof) =>
                            Array.from(fromHex(proof)),
                        ),
                        amount: reimbursement.amount.raw,
                        receiver: account.address,
                    },
                })(tx);
            }

            setLoading(true);

            try {
                const simulation = await client.simulateTransaction({
                    transaction: tx,
                    checksEnabled: false,
                    include: { effects: true },
                });

                if (simulation.$kind === "FailedTransaction") {
                    console.warn(
                        "Recover simulation failed",
                        simulation.FailedTransaction,
                    );
                    return;
                }

                setTransaction(tx);
            } catch (error) {
                console.warn("Could not simulate recover", error);
            } finally {
                setLoading(false);
            }
        };

        void build();
    }, [account, chainData, client, tokenReimbursements.reimbursements]);

    const handleRecover = useCallback(() => {
        if (!transaction || !account) return;

        const recover = async () => {
            setRecovering(true);
            try {
                const result = await dAppKit.signAndExecuteTransaction({
                    transaction,
                });

                if (result.$kind === "FailedTransaction") {
                    console.warn("Recover transaction failed");
                    toast.custom((toastId) => <RecoverFail toastId={toastId} />);
                    return;
                }

                await client.waitForTransaction({
                    digest: result.Transaction.digest,
                });

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
        account,
        dAppKit,
        client,
        chainId,
        tokenReimbursements.token,
        tokenReimbursements.totalAmount,
        onRecover,
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
                disabled={!transaction || recovered || recoveringAll}
                loading={loading || recovering || recoveringAll}
                iconPlacement="right"
                onClick={handleRecover}
            >
                {loading
                    ? t("loading")
                    : recovering || recoveringAll
                      ? t("recoveringByToken")
                      : t("recoverByToken")}
            </Button>
        </Card>
    );
}
