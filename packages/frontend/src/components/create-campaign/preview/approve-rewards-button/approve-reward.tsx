import { useCallback, useState } from "react";
import {
    useWriteContract,
    usePublicClient,
    useChainId,
    useSimulateContract,
} from "wagmi";
import { erc20Abi, type Address } from "viem";
import { encodeFunctionData } from "viem/utils";
import type { Erc20TokenAmount } from "@metrom-xyz/sdk";
import { Button } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { RewardIcon } from "@/src/assets/reward-icon";
import type { BaseTransaction } from "@safe-global/safe-apps-sdk";
import { useIsSafe } from "@/src/hooks/useIsSafe";

import styles from "./styles.module.css";

interface ApproveRewardProps {
    loading: boolean;
    disabled: boolean;
    reward: Erc20TokenAmount;
    index: number;
    totalAmount: number;
    spender?: Address;
    onApprove: () => void;
    onSafeTx: (tx: BaseTransaction) => void;
}

export function ApproveReward({
    loading,
    disabled,
    reward,
    index,
    totalAmount,
    spender,
    onApprove,
    onSafeTx,
}: ApproveRewardProps) {
    const t = useTranslations("newCampaign.submit.approveRewards");
    const publicClient = usePublicClient();
    const chainId = useChainId();
    const safeContext = useIsSafe();

    const [approving, setApproving] = useState(false);

    const { data: simulatedApprove, isLoading: simulatingApprove } =
        useSimulateContract(
            spender && {
                chainId,
                address: reward.token.address,
                abi: erc20Abi,
                functionName: "approve",
                args: [spender, reward.amount.raw],
                query: {
                    enabled:
                        !safeContext && !!spender && !!reward.token.address,
                },
            },
        );
    const { writeContractAsync: approveAsync, isPending: signingTransaction } =
        useWriteContract();

    const handleStandardApprove = useCallback(() => {
        if (!approveAsync || !publicClient || !simulatedApprove?.request)
            return;
        let cancelled = false;
        const approve = async () => {
            setApproving(true);
            try {
                const tx = await approveAsync(simulatedApprove.request);
                await publicClient.waitForTransactionReceipt({
                    hash: tx,
                });
                if (!cancelled) onApprove();
            } catch (error) {
                console.warn("could not approve reward", error);
            } finally {
                setApproving(false);
            }
        };
        void approve();
        return () => {
            cancelled = true;
        };
    }, [approveAsync, publicClient, simulatedApprove?.request, onApprove]);

    const handleSafeApprove = useCallback(() => {
        if (!spender) {
            console.warn();
            return;
        }

        onSafeTx({
            to: reward.token.address,
            data: encodeFunctionData({
                abi: erc20Abi,
                functionName: "approve",
                args: [spender, reward.amount.raw],
            }),
            value: "0",
        });

        onApprove();
        return;
    }, [onSafeTx, reward.token.address, reward.amount.raw, spender, onApprove]);

    return (
        <Button
            icon={RewardIcon}
            iconPlacement="right"
            onClick={safeContext ? handleSafeApprove : handleStandardApprove}
            disabled={!approveAsync || disabled}
            loading={
                loading || simulatingApprove || signingTransaction || approving
            }
            className={{ root: styles.button }}
        >
            {signingTransaction || approving
                ? t("approving", {
                      amount: reward.amount.formatted,
                      symbol: reward.token.symbol,
                      currentIndex: index,
                      totalAmount,
                  })
                : t("approve", {
                      amount: reward.amount.formatted,
                      symbol: reward.token.symbol,
                      currentIndex: index,
                      totalAmount,
                  })}
        </Button>
    );
}
