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
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { formatAmount } from "@/src/utils/format";
import type { BaseTransaction } from "@safe-global/safe-apps-sdk";
import { SAFE } from "@/src/commons/env";

import styles from "./styles.module.css";

interface ApproveTokenProps {
    loading: boolean;
    tokenAmount?: UsdPricedErc20TokenAmount;
    spender?: Address;
    onApproved: (token: UsdPricedErc20TokenAmount) => void;
    onApproving: (address: Address | null) => void;
    onSafeTx: (tx: BaseTransaction) => void;
}

export function ApproveToken({
    loading,
    tokenAmount,
    spender,
    onApproved,
    onApproving,
    onSafeTx,
}: ApproveTokenProps) {
    const [approving, setApproving] = useState(false);

    const t = useTranslations("newCampaign.submit.approveRewards");
    const publicClient = usePublicClient();
    const chainId = useChainId();

    const { data: simulatedApprove, isLoading: simulatingApprove } =
        useSimulateContract(
            spender && {
                chainId,
                address: tokenAmount?.token.address,
                abi: erc20Abi,
                functionName: "approve",
                args: tokenAmount
                    ? [spender, tokenAmount?.amount.raw]
                    : undefined,
                query: {
                    enabled: !SAFE,
                },
            },
        );
    const { writeContractAsync: approveAsync, isPending: signingTransaction } =
        useWriteContract();

    const handleStandardApprove = useCallback(() => {
        if (
            !approveAsync ||
            !publicClient ||
            !simulatedApprove?.request ||
            !tokenAmount
        )
            return;
        let cancelled = false;
        const approve = async () => {
            setApproving(true);
            onApproving(tokenAmount.token.address);
            try {
                const tx = await approveAsync(simulatedApprove.request);
                await publicClient.waitForTransactionReceipt({
                    hash: tx,
                });
                if (!cancelled) onApproved(tokenAmount);
            } catch (error) {
                console.warn("could not approve token", error);
            } finally {
                setApproving(false);
                onApproving(null);
            }
        };
        void approve();
        return () => {
            cancelled = true;
        };
    }, [
        tokenAmount,
        simulatedApprove?.request,
        publicClient,
        approveAsync,
        onApproved,
        onApproving,
    ]);

    const handleSafeApprove = useCallback(() => {
        if (!spender) {
            console.warn("Missing spender");
            return;
        }

        if (!tokenAmount) {
            console.warn("Missing token amount");
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

        onApproved(tokenAmount);
        return;
    }, [tokenAmount, spender, onSafeTx, onApproved]);

    return (
        <Button
            icon={ArrowRightIcon}
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
                          amount: tokenAmount?.amount.formatted,
                      }),
                      symbol: tokenAmount?.token.symbol || "",
                  })
                : t("approve", {
                      amount: formatAmount({
                          amount: tokenAmount?.amount.formatted,
                      }),
                      symbol: tokenAmount?.token.symbol || "",
                  })}
        </Button>
    );
}
