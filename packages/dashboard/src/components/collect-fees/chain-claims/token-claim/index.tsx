"use client";

import { ChainType, UsdPricedErc20TokenAmount } from "@metrom-xyz/sdk";
import { useChainType } from "@/context/chain-type";
import { TokenClaimEvm } from "./token-claim-evm";
import { TokenClaimMvm } from "./token-claim-mvm";

type TokenClaimProps = UsdPricedErc20TokenAmount;

export function TokenClaim(props: TokenClaimProps) {
    const { chainType } = useChainType();

    switch (chainType) {
        case ChainType.Aptos:
            return <TokenClaimMvm {...props} />;
        case ChainType.Evm:
            return <TokenClaimEvm {...props} />;
        default:
            throw new Error(`Unsupported chain type: ${chainType}`);
    }
}
