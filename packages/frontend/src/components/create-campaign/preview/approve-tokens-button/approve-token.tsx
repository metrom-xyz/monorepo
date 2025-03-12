import { useCallback, useState } from "react";
import {
    useWriteContract,
    usePublicClient,
    useChainId,
    useSimulateContract,
} from "wagmi";
import { erc20Abi, type Address } from "viem";
import { encodeFunctionData } from "viem/utils";
import type { UsdPricedErc20TokenAmount } from "@metrom-xyz/sdk";
import { Button } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { RewardIcon } from "@/src/assets/reward-icon";
import { formatAmount } from "@/src/utils/format";
import type { BaseTransaction } from "@safe-global/safe-apps-sdk";
import { SAFE } from "@/src/commons/env";

import styles from "./styles.module.css";

interface ApproveTokenProps {
    loading: boolean;
    tokenAmount: UsdPricedErc20TokenAmount;
    index: number;
    totalAmount: number;
    spender?: Address;
    onApprove: () => void;
    onSafeTx: (tx: BaseTransaction) => void;
}

export function ApproveToken({
    loading,
    tokenAmount,
    index,
    totalAmount,
    spender,
    onApprove,
    onSafeTx,
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
                query: {
                    enabled: !SAFE,
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
                console.warn("could not approve token", error);
            } finally {
                setApproving(false);
            }
        };
        void approve();
        return () => {
            cancelled = true;
        };
    }, [simulatedApprove?.request, publicClient, approveAsync, onApprove]);

    const handleSafeApprove = useCallback(() => {
        if (!spender) {
            console.warn("Missing spender");
            return;
        }

        onSafeTx({
            to: tokenAmount.token.address,
            data: encodeFunctionData({
                abi: erc20Abi,
                functionName: "approve",
                args: [spender, tokenAmount.amount.raw],
            }),
            value: "0",
        });

        onApprove();
        return;
    }, [
        tokenAmount.token.address,
        tokenAmount.amount.raw,
        spender,
        onSafeTx,
        onApprove,
    ]);

    return (
        <Button
            icon={RewardIcon}
            iconPlacement="right"
            onClick={SAFE ? handleSafeApprove : handleStandardApprove}
            disabled={!approveAsync}
            loading={
                loading || simulatingApprove || signingTransaction || approving
            }
            className={{ root: styles.button }}
        >
            {signingTransaction || approving
                ? t("approving", {
                      amount: formatAmount({
                          amount: tokenAmount.amount.formatted,
                      }),
                      symbol: tokenAmount.token.symbol,
                      currentIndex: index,
                      totalAmount,
                  })
                : t("approve", {
                      amount: formatAmount({
                          amount: tokenAmount.amount.formatted,
                      }),
                      symbol: tokenAmount.token.symbol,
                      currentIndex: index,
                      totalAmount,
                  })}
        </Button>
    );
}
