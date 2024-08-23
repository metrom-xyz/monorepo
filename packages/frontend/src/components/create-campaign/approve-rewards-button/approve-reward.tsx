import { useCallback, useState } from "react";
import {
    useWriteContract,
    usePublicClient,
    useChainId,
    useSimulateContract,
} from "wagmi";
import { erc20Abi, type Address, parseUnits } from "viem";
import type { TokenAmount } from "@metrom-xyz/sdk";
import { Button } from "@/src/ui/button";
import { useTranslations } from "next-intl";
import { RewardIcon } from "@/src/assets/reward-icon";

import styles from "./styles.module.css";

interface ApproveRewardProps {
    fee?: number;
    loading: boolean;
    disabled: boolean;
    reward: TokenAmount;
    index: number;
    totalAmount: number;
    spender?: Address;
    onApprove: () => void;
}

export function ApproveReward({
    // TODO: show fee somewhere
    fee,
    loading,
    disabled,
    reward,
    index,
    totalAmount,
    spender,
    onApprove,
}: ApproveRewardProps) {
    const t = useTranslations("newCampaign.submit.approveRewards");
    const publicClient = usePublicClient();
    const chainId = useChainId();
    const [approving, setApproving] = useState(false);

    const { data: simulatedApprove, isLoading: simulatingApprove } =
        useSimulateContract(
            spender && {
                chainId,
                address: reward.token.address,
                abi: erc20Abi,
                functionName: "approve",
                args: [
                    spender,
                    parseUnits(reward.amount.toString(), reward.token.decimals),
                ],
                query: {
                    enabled: !!spender && !!reward.token.address,
                },
            },
        );
    const { writeContractAsync: approveAsync, isPending: signingTransaction } =
        useWriteContract();

    const handleClick = useCallback(() => {
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
    }, [approveAsync, simulatedApprove?.request, onApprove, publicClient]);

    return (
        <Button
            icon={RewardIcon}
            iconPlacement="right"
            onClick={handleClick}
            disabled={!approveAsync || disabled}
            loading={
                loading || simulatingApprove || signingTransaction || approving
            }
            className={{ root: styles.button }}
        >
            {signingTransaction || approving
                ? t("approving", {
                      amount: reward.amount,
                      symbol: reward.token.symbol,
                      currentIndex: index,
                      totalAmount,
                  })
                : t("approve", {
                      amount: reward.amount,
                      symbol: reward.token.symbol,
                      currentIndex: index,
                      totalAmount,
                  })}
        </Button>
    );
}
