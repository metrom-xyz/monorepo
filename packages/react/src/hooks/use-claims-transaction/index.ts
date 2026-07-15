import { ChainType } from "@metrom-xyz/sdk";
import type { Address } from "viem";
import { ClaimWithRemaining } from "../../types";
import {
    useClaimsTransactionEvm,
    type UseClaimsTransactionEvmReturnValue,
} from "./useClaimsTransactionEvm";
import {
    useClaimsTransactionMvm,
    type UseClaimsTransactionMvmReturnValue,
} from "./useClaimsTransactionMvm";
import {
    useClaimsTransactionSvm,
    type UseClaimsTransactionSvmReturnValue,
} from "./useClaimsTransactionSvm";
import {
    useClaimsTransactionSui,
    type UseClaimsTransactionSuiReturnValue,
} from "./useClaimsTransactionSui";

export interface UseClaimsTransactionParams {
    chainType?: ChainType;
    chainId: number;
    claims: ClaimWithRemaining[];
    address?: string;
    enabled?: boolean;
}

export type UseClaimsTransactionReturnValue =
    | UseClaimsTransactionEvmReturnValue
    | UseClaimsTransactionMvmReturnValue
    | UseClaimsTransactionSvmReturnValue
    | UseClaimsTransactionSuiReturnValue;

/** https://docs.metrom.xyz/react-library/use-claims-transaction */
export function useClaimsTransaction({
    chainType = ChainType.Evm,
    chainId,
    claims,
    address,
    enabled = true,
}: UseClaimsTransactionParams): UseClaimsTransactionReturnValue {
    const claimsTransactionEvm = useClaimsTransactionEvm({
        chainId,
        claims,
        address: address as Address | undefined,
        enabled: enabled && chainType === ChainType.Evm,
    });
    const claimsTransactionMvm = useClaimsTransactionMvm({
        claims,
        address,
        enabled: enabled && chainType === ChainType.Aptos,
    });
    const claimsTransactionSvm = useClaimsTransactionSvm({
        claims,
        address,
        enabled: enabled && chainType === ChainType.Svm,
    });
    const claimsTransactionSui = useClaimsTransactionSui({
        claims,
        address,
        enabled: enabled && chainType === ChainType.Sui,
    });

    switch (chainType) {
        case ChainType.Evm:
            return claimsTransactionEvm;
        case ChainType.Aptos:
            return claimsTransactionMvm;
        case ChainType.Svm:
            return claimsTransactionSvm;
        case ChainType.Sui:
            return claimsTransactionSui;
        default:
            throw new Error(
                `Unsupported chain type ${chainType} in useClaimsTransaction`,
            );
    }
}
