import { useCallback, useState, useEffect } from "react";
import { type Address } from "viem";
import { ApproveToken } from "./approve-token";
import type { BaseTransaction } from "@safe-global/safe-apps-sdk";
import type { Erc20TokenAmountWithAllowance } from "@/src/types/campaign/common";
import type { UsdPricedErc20TokenAmount } from "@metrom-xyz/sdk";

interface ApproveTokensProps {
    tokensToApprove: Erc20TokenAmountWithAllowance[];
    spender?: Address;
    onApproved: (token: UsdPricedErc20TokenAmount) => void;
    onApproving: (address: Address | null) => void;
    onSafeTx: (tx: BaseTransaction) => void;
}

export function ApproveTokens({
    tokensToApprove,
    spender,
    onApproved,
    onApproving,
    onSafeTx,
}: ApproveTokensProps) {
    const [checkingApprovals, setCheckingApprovals] = useState(false);

    const currentlyApprovingTokenAmount = tokensToApprove.find(
        ({ approved }) => !approved,
    );

    useEffect(() => {
        setCheckingApprovals(true);
        const newToApprove = tokensToApprove.filter(
            ({ approved }) => !approved,
        );

        if (newToApprove.length === 0) {
            setCheckingApprovals(false);
            return;
        }

        setCheckingApprovals(false);
    }, [tokensToApprove]);

    const handleOnApprove = useCallback(
        (token: UsdPricedErc20TokenAmount) => {
            if (!spender) {
                console.warn(
                    "spender is undefined while handling approval: inconsistent state",
                );
                return;
            }

            onApproved(token);
        },
        [onApproved, spender],
    );

    if (!currentlyApprovingTokenAmount) return null;

    return (
        <ApproveToken
            loading={checkingApprovals || !spender}
            tokenAmount={currentlyApprovingTokenAmount}
            spender={spender}
            onApproved={handleOnApprove}
            onApproving={onApproving}
            onSafeTx={onSafeTx}
        />
    );
}
