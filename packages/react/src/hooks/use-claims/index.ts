import { ChainType } from "@metrom-xyz/sdk";
import type { Address } from "viem";
import {
    ClaimWithRemaining,
    QueryOptions,
    type QueryResult,
} from "../../types";
import { useClaimsEvm } from "./useClaimsEvm";
import { useClaimsMvm } from "./useClaimsMvm";
import { useClaimsSvm } from "./useClaimsSvm";
import { useClaimsSui } from "./useClaimsSui";

export interface UseClaimsParams extends QueryOptions<
    ClaimWithRemaining[] | undefined
> {
    chainType?: ChainType;
    address?: string;
}

export type UseClaimsReturnValue = QueryResult<
    ClaimWithRemaining[] | undefined
>;

/** https://docs.metrom.xyz/react-library/use-claims */
export function useClaims({
    chainType = ChainType.Evm,
    address,
    options,
}: UseClaimsParams): UseClaimsReturnValue {
    const enabled = options?.enabled ?? true;

    const claimsEvm = useClaimsEvm({
        address: address as Address | undefined,
        options: {
            ...options,
            enabled: enabled && chainType === ChainType.Evm,
        },
    });
    const claimsMvm = useClaimsMvm({
        address,
        options: {
            ...options,
            enabled: enabled && chainType === ChainType.Aptos,
        },
    });
    const claimsSvm = useClaimsSvm({
        address,
        options: {
            ...options,
            enabled: enabled && chainType === ChainType.Svm,
        },
    });
    const claimsSui = useClaimsSui({
        address,
        options: {
            ...options,
            enabled: enabled && chainType === ChainType.Sui,
        },
    });

    switch (chainType) {
        case ChainType.Evm:
            return claimsEvm;
        case ChainType.Aptos:
            return claimsMvm;
        case ChainType.Svm:
            return claimsSvm;
        case ChainType.Sui:
            return claimsSui;
        default:
            throw new Error(`Unsupported chain type ${chainType} in useClaims`);
    }
}
