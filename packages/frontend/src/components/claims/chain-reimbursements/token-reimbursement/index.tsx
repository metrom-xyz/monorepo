import classNames from "classnames";
import { Typography, Button, Skeleton, Card } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import {
    useAccount,
    usePublicClient,
    useSimulateContract,
    useSwitchChain,
    useWriteContract,
} from "wagmi";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import { useCallback, useMemo, useState } from "react";
import type { TokenReimbursements } from "..";
import { toast } from "sonner";
import { useChainData } from "@/src/hooks/useChainData";
import { formatAmount, formatUsdAmount } from "@/src/utils/format";
import { trackFathomEvent } from "@/src/utils/fathom";
import { RemoteLogo } from "@/src/components/remote-logo";
import { type WriteContractErrorType, encodeFunctionData } from "viem";
import type { Erc20Token } from "@metrom-xyz/sdk";
import { RecoverSuccess } from "../../notification/recover-success";
import { RecoverFail } from "../../notification/recover-fail";
import { SAFE } from "@/src/commons/env";
import { SAFE_APP_SDK } from "@/src/commons";

import styles from "./styles.module.css";

interface TokenReimbursementProps {
    chainId: number;
    tokenReimbursements: TokenReimbursements;
    disabled?: boolean;
    onRecover: (token: Erc20Token) => void;
}

export function TokenReimbursement({
    onRecover,
    chainId,
    tokenReimbursements,
    disabled,
}: TokenReimbursementProps) {
    const t = useTranslations("rewards.reimbursements");
    const { address: account } = useAccount();
    const publicClient = usePublicClient();
    const { switchChainAsync } = useSwitchChain();
    const { writeContractAsync } = useWriteContract();
    const chainData = useChainData(chainId);

    const [recovering, setRecovering] = useState(false);
    const [recovered, setRecovered] = useState(false);

    const recoverRewardsArgs = useMemo(() => {
        if (!account) return [];

        return tokenReimbursements.reimbursements.map((reimbursement) => {
            return {
                campaignId: reimbursement.campaignId,
                proof: reimbursement.proof,
                token: reimbursement.token.address,
                amount: reimbursement.amount.raw,
                receiver: account,
            };
        });
    }, [account, tokenReimbursements.reimbursements]);

    const {
        data: simulatedRecover,
        isLoading: simulatingRecover,
        isError: simulateRecoverErrored,
    } = useSimulateContract({
        chainId,
        abi: metromAbi,
        address: chainData?.metromContract.address,
        functionName: "recoverRewards",
        args: [recoverRewardsArgs],
        query: {
            refetchOnMount: false,
            enabled:
                !SAFE &&
                !!account &&
                tokenReimbursements.reimbursements.length > 0,
        },
    });

    const handleStandardRecover = useCallback(() => {
        if (!writeContractAsync || !publicClient || !simulatedRecover?.request)
            return;
        const recover = async () => {
            setRecovering(true);
            try {
                await switchChainAsync({ chainId });

                const tx = await writeContractAsync(simulatedRecover.request);
                const receipt = await publicClient.waitForTransactionReceipt({
                    hash: tx,
                });

                if (receipt.status === "reverted") {
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
                if (
                    !(error as WriteContractErrorType).message.includes(
                        "User rejected",
                    )
                )
                    toast.custom((toastId) => (
                        <RecoverFail toastId={toastId} />
                    ));

                console.warn("Could not recover", error);
            } finally {
                setRecovering(false);
            }
        };

        void recover();
    }, [
        chainId,
        publicClient,
        simulatedRecover,
        tokenReimbursements.token,
        tokenReimbursements.totalAmount,
        onRecover,
        switchChainAsync,
        writeContractAsync,
    ]);

    const handleSafeRecover = useCallback(() => {
        if (!chainData) {
            console.warn(
                "Missing parameters to recover rewards through Safe: aborting",
            );
            return;
        }

        const recover = async () => {
            setRecovering(true);

            try {
                await SAFE_APP_SDK.txs.send({
                    txs: [
                        {
                            to: chainData.metromContract.address,
                            data: encodeFunctionData({
                                abi: metromAbi,
                                functionName: "recoverRewards",
                                args: [recoverRewardsArgs],
                            }),
                            value: "0",
                        },
                    ],
                });

                toast.custom((toastId) => (
                    <RecoverSuccess
                        toastId={toastId}
                        chain={chainId}
                        token={tokenReimbursements.token}
                        amount={tokenReimbursements.totalAmount}
                        safe
                    />
                ));
                setRecovered(true);
                onRecover(tokenReimbursements.token);
                trackFathomEvent("CLICK_RECOVER_SINGLE");
            } catch (error) {
                console.warn("Could not recover", error);
            } finally {
                setRecovering(false);
            }
        };

        void recover();
    }, [
        chainId,
        recoverRewardsArgs,
        tokenReimbursements.token,
        tokenReimbursements.totalAmount,
        chainData,
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
                        {formatUsdAmount(
                            tokenReimbursements.totalAmount *
                                tokenReimbursements.token.usdPrice,
                        )}
                    </Typography>
                </div>
            </div>
            <Button
                variant="secondary"
                size="sm"
                disabled={simulateRecoverErrored || recovered || disabled}
                loading={simulatingRecover || recovering}
                iconPlacement="right"
                onClick={SAFE ? handleSafeRecover : handleStandardRecover}
            >
                {simulatingRecover
                    ? t("loading")
                    : recovering
                      ? t("recoveringByToken")
                      : t("recoverByToken")}
            </Button>
        </Card>
    );
}

export function SkeletonTokenReimbursement() {
    return (
        <div className={classNames(styles.root)}>
            <div className={styles.leftWrapper}>
                <RemoteLogo loading />
                <Skeleton width={60} size="lg" />
                <div className={styles.amountWrapper}>
                    <Skeleton width={70} size="lg" />
                    <Skeleton width={40} size="sm" />
                </div>
            </div>
            <Button variant="secondary" size="sm" loading />
        </div>
    );
}
