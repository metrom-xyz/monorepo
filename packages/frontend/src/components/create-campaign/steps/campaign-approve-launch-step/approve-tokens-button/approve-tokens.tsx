import { useCallback } from "react";
import { type Address } from "viem";
import { ApproveToken } from "./approve-token";
import type { BaseTransaction } from "@safe-global/safe-apps-sdk";
import type { Erc20TokenAmountWithAllowance } from "@/src/types/campaign/common";
import type { UsdPricedErc20TokenAmount } from "@metrom-xyz/sdk";

interface ApproveTokensProps {
    tokensToApprove: Erc20TokenAmountWithAllowance[];
    checkingApprovals: boolean;
    spender?: Address;
    onApproved: (token: UsdPricedErc20TokenAmount) => void;
    onApproving: (address: Address | null) => void;
    onSafeTx: (tx: BaseTransaction) => void;
}

export function ApproveTokens({
    tokensToApprove,
    checkingApprovals,
    spender,
    onApproved,
    onApproving,
    onSafeTx,
}: ApproveTokensProps) {
    const currentlyApprovingTokenAmount = tokensToApprove.find(
        ({ approved }) => !approved,
    );

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
