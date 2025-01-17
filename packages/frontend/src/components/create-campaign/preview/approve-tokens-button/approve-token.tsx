import { useCallback, useState } from "react";
import {
    useWriteContract,
    usePublicClient,
    useChainId,
    useSimulateContract,
} from "wagmi";
import { erc20Abi, type Address } from "viem";
import type { UsdPricedErc20TokenAmount } from "@metrom-xyz/sdk";
import { Button } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { RewardIcon } from "@/src/assets/reward-icon";

import styles from "./styles.module.css";
import { formatTokenAmount } from "@/src/utils/format";

interface ApproveTokenProps {
    loading: boolean;
    tokenAmount: UsdPricedErc20TokenAmount;
    index: number;
    totalAmount: number;
    spender?: Address;
    onApprove: () => void;
}

export function ApproveToken({
    loading,
    tokenAmount,
    index,
    totalAmount,
    spender,
    onApprove,
}: ApproveTokenProps) {
    const t = useTranslations("newCampaign.submit.approveRewards");
    const publicClient = usePublicClient();
    const chainId = useChainId();
    const [approving, setApproving] = useState(false);

    const { data: simulatedApprove, isLoading: simulatingApprove } =
        useSimulateContract(
            spender && {
                chainId,
                address: tokenAmount.token.address,
                abi: erc20Abi,
                functionName: "approve",
                args: [spender, tokenAmount.amount.raw],
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
                console.warn("could not approve token", error);
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
            disabled={!approveAsync}
            loading={
                loading || simulatingApprove || signingTransaction || approving
            }
            className={{ root: styles.button }}
        >
            {signingTransaction || approving
                ? t("approving", {
                      amount: formatTokenAmount({
                          amount: tokenAmount.amount.formatted,
                      }),
                      symbol: tokenAmount.token.symbol,
                      currentIndex: index,
                      totalAmount,
                  })
                : t("approve", {
                      amount: formatTokenAmount({
                          amount: tokenAmount.amount.formatted,
                      }),
                      symbol: tokenAmount.token.symbol,
                      currentIndex: index,
                      totalAmount,
                  })}
        </Button>
    );
}
