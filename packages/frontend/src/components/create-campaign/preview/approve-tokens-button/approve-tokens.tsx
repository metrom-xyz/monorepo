import { useCallback, useState, useEffect } from "react";
import { useReadContracts } from "wagmi";
import { useAccount } from "@/src/hooks/useAccount";
import { type Address, erc20Abi } from "viem";
import { ApproveToken } from "./approve-token";
import type { UsdPricedErc20TokenAmount } from "@metrom-xyz/sdk";
import type { BaseTransaction } from "@safe-global/safe-apps-sdk";

interface ApproveTokensProps {
    tokenAmounts: [UsdPricedErc20TokenAmount, ...UsdPricedErc20TokenAmount[]];
    spender?: Address;
    onApprove: () => void;
    onSafeTx: (tx: BaseTransaction) => void;
}

export function ApproveTokens({
    tokenAmounts,
    spender,
    onApprove,
    onSafeTx,
}: ApproveTokensProps) {
    const { address: connectedAddress } = useAccount();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [checkingApprovals, setCheckingApprovals] = useState(false);
    const [toApprove, setToApprove] = useState(tokenAmounts);
    const currentlyApprovingTokenAmount: UsdPricedErc20TokenAmount =
        toApprove[currentIndex];

    const { data: allowances, isLoading: loadingAllowances } = useReadContracts(
        {
            contracts:
                connectedAddress &&
                spender &&
                tokenAmounts.map((token) => {
                    return {
                        address: token.token.address,
                        abi: erc20Abi,
                        functionName: "allowance",
                        args: [connectedAddress, spender],
                    };
                }),
            query: {
                enabled:
                    !!connectedAddress && tokenAmounts.length > 0 && !!spender,
            },
        },
    );

    useEffect(() => {
        if (!allowances || allowances.length !== tokenAmounts.length) return;

        setCheckingApprovals(true);
        const newToApprove: UsdPricedErc20TokenAmount[] = [];
        for (let i = 0; i < tokenAmounts.length; i++) {
            const token = tokenAmounts[i];
            if (
                allowances[i]?.result === null ||
                allowances[i]?.result === undefined
            )
                return;
            if ((allowances[i].result as bigint) >= token.amount.raw) continue;
            newToApprove.push(token);
        }
        if (newToApprove.length === 0) {
            onApprove();
            setCheckingApprovals(false);
            return;
        }
        setCheckingApprovals(false);
        setToApprove(
            newToApprove as [
                UsdPricedErc20TokenAmount,
                ...UsdPricedErc20TokenAmount[],
            ],
        );
    }, [allowances, onApprove, tokenAmounts]);

    const handleApprove = useCallback(() => {
        if (!spender) {
            console.warn(
                "spender is undefined while handling approval: inconsistent state",
            );
            return;
        }

        const updatedIndex = currentIndex + 1;
        if (!toApprove[updatedIndex]) {
            onApprove();
        } else setCurrentIndex(updatedIndex);
    }, [currentIndex, onApprove, spender, toApprove]);

    return (
        <ApproveToken
            loading={
                checkingApprovals ||
                loadingAllowances ||
                !currentlyApprovingTokenAmount ||
                !spender
            }
            tokenAmount={currentlyApprovingTokenAmount}
            index={currentIndex + 1}
            totalAmount={tokenAmounts.length}
            spender={spender}
            onApprove={handleApprove}
            onSafeTx={onSafeTx}
        />
    );
}
