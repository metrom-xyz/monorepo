"use client";

import classNames from "classnames";
import { Typography, Button, Card } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { trackUmamiEvent } from "@/src/utils/umami";
import { toast } from "sonner";
import { ClaimSuccess } from "../notification/claim-success";
import { ClaimFail } from "../notification/claim-fail";
import { RecoverSuccess } from "../notification/recover-success";
import { RecoverFail } from "../notification/recover-fail";
import { formatUsdAmount } from "@/src/utils/format";
import type { ChainOverviewProps } from ".";
import {
    useCurrentAccount,
    useCurrentClient,
    useDAppKit,
} from "@mysten/dapp-kit-react";
import { Transaction } from "@mysten/sui/transactions";
import { claimRewards, recoverRewards } from "@metrom-xyz/sui-contracts/client";
import { fromHex } from "@mysten/sui/utils";

import styles from "./styles.module.css";

export function ChainOverviewSui({
    className,
    chainWithRewardsData,
    onClaimAll,
    onRecoverAll,
    onClaiming,
    onRecovering,
}: ChainOverviewProps) {
    const [claiming, setClaiming] = useState(false);
    const [recovering, setRecovering] = useState(false);
    const [recoverAllTx, setRecoverAllTx] = useState<Transaction>();
    const [claimAllTx, setClaimAllTx] = useState<Transaction>();
    const [simulatingRecoverAll, setSimulatingRecoverAll] = useState(false);
    const [simulatingClaimAll, setSimulatingClaimAll] = useState(false);

    const t = useTranslations("rewards");
    const account = useCurrentAccount();
    const client = useCurrentClient();
    const dAppKit = useDAppKit();

    const ChainIcon = chainWithRewardsData.chainData.icon;
    const { address: packageAddress, stateAddress } =
        chainWithRewardsData.chainData.metromContract;

    useEffect(() => {
        const build = async () => {
            setRecoverAllTx(undefined);

            if (
                !account ||
                !stateAddress ||
                chainWithRewardsData.reimbursements.length === 0
            )
                return;

            const tx = new Transaction();
            tx.setSender(account.address);

            for (const reimbursement of chainWithRewardsData.reimbursements) {
                recoverRewards({
                    package: packageAddress,
                    typeArguments: [reimbursement.token.address],
                    arguments: {
                        state: stateAddress,
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

            setSimulatingRecoverAll(true);

            try {
                const result = await client.simulateTransaction({
                    transaction: tx,
                    checksEnabled: false,
                    include: { effects: true },
                });

                if (result.$kind === "FailedTransaction") {
                    console.warn("Recover all simulation failed");
                    return;
                }

                setRecoverAllTx(tx);
            } catch (error) {
                console.warn("Could not simulate recover all", error);
            } finally {
                setSimulatingRecoverAll(false);
            }
        };

        void build();
    }, [
        account,
        stateAddress,
        packageAddress,
        chainWithRewardsData.reimbursements,
        client,
    ]);

    useEffect(() => {
        const build = async () => {
            setClaimAllTx(undefined);

            if (
                !account ||
                !stateAddress ||
                chainWithRewardsData.claims.length === 0
            )
                return;

            const tx = new Transaction();
            tx.setSender(account.address);

            for (const claim of chainWithRewardsData.claims) {
                claimRewards({
                    package: packageAddress,
                    typeArguments: [claim.token.address],
                    arguments: {
                        state: stateAddress,
                        campaignId: Array.from(fromHex(claim.campaignId)),
                        proof: claim.proof.map((proof) =>
                            Array.from(fromHex(proof)),
                        ),
                        amount: claim.amount.raw,
                        receiver: account.address,
                    },
                })(tx);
            }

            setSimulatingClaimAll(true);

            try {
                const result = await client.simulateTransaction({
                    transaction: tx,
                    checksEnabled: false,
                    include: { effects: true },
                });

                if (result.$kind === "FailedTransaction") {
                    console.warn("Claim all simulation failed");
                    return;
                }

                setClaimAllTx(tx);
            } catch (error) {
                console.warn("Could not simulate claim all", error);
            } finally {
                setSimulatingClaimAll(false);
            }
        };

        void build();
    }, [
        account,
        stateAddress,
        packageAddress,
        chainWithRewardsData.claims,
        client,
    ]);

    useEffect(() => {
        if (onClaiming) onClaiming(claiming);
    }, [claiming, onClaiming]);

    useEffect(() => {
        if (onRecovering) onRecovering(recovering);
    }, [recovering, onRecovering]);

    const handleRecoverAll = useCallback(() => {
        if (!recoverAllTx || !account) return;

        const recover = async () => {
            setRecovering(true);
            try {
                const result = await dAppKit.signAndExecuteTransaction({
                    transaction: recoverAllTx,
                });

                if (result.$kind === "FailedTransaction") {
                    console.warn("Recover all transaction failed");
                    toast.custom((toastId) => (
                        <RecoverFail toastId={toastId} />
                    ));
                    return;
                }

                await client.waitForTransaction({
                    digest: result.Transaction.digest,
                });

                toast.custom((toastId) => <RecoverSuccess toastId={toastId} />);
                onRecoverAll();
                trackUmamiEvent("click-recover-all");
            } catch (error) {
                toast.custom((toastId) => <RecoverFail toastId={toastId} />);
                console.warn("Could not recover all", error);
            } finally {
                setRecovering(false);
            }
        };
        void recover();
    }, [recoverAllTx, account, dAppKit, client, onRecoverAll]);

    const handleClaimAll = useCallback(() => {
        if (!claimAllTx || !account) return;

        const claim = async () => {
            setClaiming(true);
            try {
                const result = await dAppKit.signAndExecuteTransaction({
                    transaction: claimAllTx,
                });

                if (result.$kind === "FailedTransaction") {
                    console.warn("Claim all transaction failed");
                    toast.custom((toastId) => (
                        <ClaimFail
                            toastId={toastId}
                            message={t("claims.notification.fail.message")}
                        />
                    ));
                    return;
                }

                await client.waitForTransaction({
                    digest: result.Transaction.digest,
                });

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
                console.warn("Could not claim all", error);
            } finally {
                setClaiming(false);
            }
        };
        void claim();
    }, [t, claimAllTx, account, dAppKit, client, onClaimAll]);

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
                        disabled={!recoverAllTx}
                        loading={simulatingRecoverAll || recovering}
                        iconPlacement="right"
                        onClick={handleRecoverAll}
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
                        disabled={!claimAllTx}
                        loading={simulatingClaimAll || claiming}
                        iconPlacement="right"
                        onClick={handleClaimAll}
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
