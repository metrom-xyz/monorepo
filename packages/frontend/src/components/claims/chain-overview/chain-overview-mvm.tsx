import classNames from "classnames";
import { Typography, Button, Card } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { useAccount } from "@/src/hooks/useAccount";
import { useCallback, useEffect, useMemo, useState } from "react";
import { trackFathomEvent } from "@/src/utils/fathom";
import { toast } from "sonner";
import { ClaimSuccess } from "../notification/claim-success";
import { ClaimFail } from "../notification/claim-fail";
import { RecoverSuccess } from "../notification/recover-success";
import { RecoverFail } from "../notification/recover-fail";
import { formatUsdAmount } from "@/src/utils/format";
import type { ChainOverviewProps } from ".";
import type {
    InputGenerateTransactionPayloadData,
    MoveFunctionId,
} from "@aptos-labs/ts-sdk";
import { buildRewardsFunctionArgs } from "@/src/utils/aptos";
import {
    useClients,
    useSignAndSubmitTransaction,
    useSimulateTransaction,
} from "@aptos-labs/react";

import styles from "./styles.module.css";

export function ChainOverviewMvm({
    className,
    chainWithRewardsData,
    onClaimAll,
    onRecoverAll,
    onClaiming,
    onRecovering,
}: ChainOverviewProps) {
    const t = useTranslations("rewards");
    const { address: account } = useAccount();
    const { aptos } = useClients();

    const [claiming, setClaiming] = useState(false);
    const [recovering, setRecovering] = useState(false);

    const ChainIcon = chainWithRewardsData.chainData.icon;

    const recoverRewardsTxPayload:
        | InputGenerateTransactionPayloadData
        | undefined = useMemo(() => {
        if (!account) return undefined;

        const { metromContract: metrom } = chainWithRewardsData.chainData;
        const moveFunction: MoveFunctionId = `${metrom.address}::metrom::recover_rewards`;

        return {
            function: moveFunction,
            functionArguments: buildRewardsFunctionArgs(
                account,
                chainWithRewardsData.reimbursements,
            ),
        };
    }, [
        account,
        chainWithRewardsData.chainData,
        chainWithRewardsData.reimbursements,
    ]);

    const claimRewardsTxPayload:
        | InputGenerateTransactionPayloadData
        | undefined = useMemo(() => {
        if (!account) return undefined;

        const { metromContract: metrom } = chainWithRewardsData.chainData;
        const moveFunction: MoveFunctionId = `${metrom.address}::metrom::claim_rewards`;

        return {
            function: moveFunction,
            functionArguments: buildRewardsFunctionArgs(
                account,
                chainWithRewardsData.claims,
            ),
        };
    }, [account, chainWithRewardsData.chainData, chainWithRewardsData.claims]);

    const {
        data: simulatedRecoverAll,
        isLoading: simulatingRecoverAll,
        isError: simulatedRecoverAllErrored,
    } = useSimulateTransaction({
        data: recoverRewardsTxPayload,
        refetchOnMount: false,
        options: {
            estimateGasUnitPrice: true,
            estimateMaxGasAmount: true,
        },
        enabled: !!account && chainWithRewardsData.reimbursements.length > 0,
    });

    const {
        data: simulatedClaimAll,
        isLoading: simulatingClaimAll,
        isError: simulatedClaimAllErrored,
    } = useSimulateTransaction({
        data: claimRewardsTxPayload,
        refetchOnMount: false,
        options: {
            estimateGasUnitPrice: true,
            estimateMaxGasAmount: true,
        },
        enabled: !!account && chainWithRewardsData.claims.length > 0,
    });

    const { signAndSubmitTransactionAsync } = useSignAndSubmitTransaction();

    useEffect(() => {
        if (onClaiming) onClaiming(claiming);
    }, [claiming, onClaiming]);

    useEffect(() => {
        if (onRecovering) onRecovering(recovering);
    }, [recovering, onRecovering]);

    const handleStandardRecoverAll = useCallback(() => {
        if (
            !recoverRewardsTxPayload ||
            simulatedRecoverAllErrored ||
            !simulatedRecoverAll?.success
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

                toast.custom((toastId) => <RecoverSuccess toastId={toastId} />);
                onRecoverAll();
                trackFathomEvent("CLICK_RECOVER_ALL");
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
        recoverRewardsTxPayload,
        simulatedRecoverAllErrored,
        simulatedRecoverAll,
        signAndSubmitTransactionAsync,
        onRecoverAll,
    ]);

    const handleStandardClaimAll = useCallback(() => {
        if (
            !claimRewardsTxPayload ||
            simulatedClaimAllErrored ||
            !simulatedClaimAll?.success
        )
            return;

        const claim = async () => {
            setClaiming(true);
            try {
                const tx = await signAndSubmitTransactionAsync({
                    data: claimRewardsTxPayload,
                });
                const receipt = await aptos.waitForTransaction({
                    transactionHash: tx.hash,
                });

                if (!receipt.success) {
                    console.warn("Claim transaction reverted");
                    throw new Error("Transaction reverted");
                }

                toast.custom((toastId) => <ClaimSuccess toastId={toastId} />);
                onClaimAll();
                trackFathomEvent("CLICK_CLAIM_ALL");
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
        aptos,
        t,
        claimRewardsTxPayload,
        simulatedClaimAllErrored,
        simulatedClaimAll,
        signAndSubmitTransactionAsync,
        onClaimAll,
    ]);

    return (
        <Card className={classNames(styles.root, className)}>
            <div className={styles.chainNameWrapper}>
                <ChainIcon className={styles.chainIcon} />
                <Typography size="xl4" truncate>
                    {chainWithRewardsData.chainData.name}
                </Typography>
                <Typography size="xl2" weight="medium" light>
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
                            simulatedRecoverAllErrored ||
                            !simulatedRecoverAll?.success
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
                            simulatedClaimAllErrored ||
                            !simulatedClaimAll?.success
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
