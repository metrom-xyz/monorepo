import { Typography, Button, Card } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { useAccount } from "@/src/hooks/useAccount";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { formatAmount, formatUsdAmount } from "@/src/utils/format";
import { trackFathomEvent } from "@/src/utils/fathom";
import { RemoteLogo } from "@/src/components/remote-logo";
import { RecoverSuccess } from "../../notification/recover-success";
import { RecoverFail } from "../../notification/recover-fail";
import { useChainData } from "@/src/hooks/useChainData";
import type { TokenReimbursementProps } from ".";
import type {
    InputGenerateTransactionPayloadData,
    MoveFunctionId,
} from "@aptos-labs/ts-sdk";
import {
    useClients,
    useSignAndSubmitTransaction,
    useSimulateTransaction,
} from "@aptos-labs/react";
import { buildRewardsFunctionArgs } from "@/src/utils/aptos";

import styles from "./styles.module.css";

export function TokenReimbursementMvm({
    onRecover,
    chainId,
    tokenReimbursements,
    recoveringAll,
}: TokenReimbursementProps) {
    const t = useTranslations("rewards.reimbursements");
    const { address: account } = useAccount();
    const chainData = useChainData({ chainId });
    const { aptos } = useClients();

    const [recovering, setRecovering] = useState(false);
    const [recovered, setRecovered] = useState(false);

    const recoverRewardsTxPayload:
        | InputGenerateTransactionPayloadData
        | undefined = useMemo(() => {
        if (!account || !chainData) return undefined;

        const { metromContract: metrom } = chainData;
        const moveFunction: MoveFunctionId = `${metrom.address}::metrom::recover_rewards`;

        return {
            function: moveFunction,
            functionArguments: buildRewardsFunctionArgs(
                account,
                tokenReimbursements.reimbursements,
            ),
        };
    }, [account, chainData, tokenReimbursements.reimbursements]);

    const {
        data: simulatedRecover,
        isLoading: simulatingRecover,
        isError: simulateRecoverErrored,
    } = useSimulateTransaction({
        data: recoverRewardsTxPayload,
    });

    useEffect(() => {
        if (simulatingRecover || (simulatedRecover && simulatedRecover.success))
            return;

        console.warn(
            `Recover simulation failed with error ${simulatedRecover?.vm_status}`,
            simulatedRecover,
        );
    }, [simulatingRecover, simulatedRecover]);

    const { signAndSubmitTransactionAsync } = useSignAndSubmitTransaction();

    const handleStandardRecover = useCallback(() => {
        if (
            !recoverRewardsTxPayload ||
            simulateRecoverErrored ||
            !simulatedRecover?.success
        )
            return;
        const recover = async () => {
            setRecovering(true);
            try {
                const tx = await signAndSubmitTransactionAsync({
                    data: recoverRewardsTxPayload,
                });
                const receipt = await aptos.waitForTransaction({
                    transactionHash: tx.hash,
                });

                if (!receipt.success) {
                    console.warn("Recover transaction reverted");
                    throw new Error("Transaction reverted");
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
                onRecover(tokenReimbursements.token);
                trackFathomEvent("CLICK_RECOVER_SINGLE");
            } catch (error) {
                toast.custom((toastId) => <RecoverFail toastId={toastId} />);
                console.warn("Could not recover", error);
            } finally {
                setRecovering(false);
            }
        };

        void recover();
    }, [
        aptos,
        chainId,
        recoverRewardsTxPayload,
        simulateRecoverErrored,
        simulatedRecover,
        tokenReimbursements.token,
        tokenReimbursements.totalAmount,
        signAndSubmitTransactionAsync,
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
                    <Typography size="sm" weight="medium" light>
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
                    simulateRecoverErrored ||
                    !simulatedRecover?.success ||
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
