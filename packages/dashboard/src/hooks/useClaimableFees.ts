import { formatUnits } from "viem";
import { useRewardTokens } from "./useRewardTokens";
import { FunctionComponent, useMemo } from "react";
import { UsdPricedErc20TokenAmount } from "@metrom-xyz/sdk";
import { getChainData } from "@/utils/chain";
import { SVGIcon } from "@metrom-xyz/chains";
import { useReadClaimableFees } from "./useReadClaimableFees";

interface ChainClaimableFees {
    totalUsd: number;
    chain: {
        id: number;
        name: string;
        icon: FunctionComponent<SVGIcon>;
    };
    tokens: UsdPricedErc20TokenAmount[];
}

interface UseClaimableFeesReturnValue {
    loading: boolean;
    totalUsd: number;
    claimableFees?: ClaimableFees;
}

export type ClaimableFees = Record<number, ChainClaimableFees>;

export function useClaimableFees(): UseClaimableFeesReturnValue {
    const { tokens, loading: loadingTokens } = useRewardTokens();
    const { results: rawClaimableFees, loading: loadingClaimableFees } =
        useReadClaimableFees({ tokens });

    const { totalUsd, claimableFees } = useMemo(() => {
        if (!tokens || !rawClaimableFees)
            return { totalUsd: 0, claimableFees: undefined };

        let totalUsd = 0;
        const byChain: ClaimableFees = {};

        rawClaimableFees.forEach((claimableFee, index) => {
            if (claimableFee === null || claimableFee === undefined) return;

            const raw = claimableFee as unknown as bigint;

            const token = tokens[index];
            if (!token) {
                console.error(`Couldn't get token ${index} from whitelist`);
                throw new Error(`Token index ${index} missing from whitelist`);
            }

            const chainData = getChainData(token.chainId);
            if (!chainData) {
                console.error(`Couldn't get data for chain ${token.chainId}`);
                throw new Error(`Data missing for chain ${token.chainId}`);
            }

            const { address, decimals, name, symbol, usdPrice } = token;
            const chainId = token.chainId;
            const formatted = Number(formatUnits(raw, decimals));
            const usdValue = formatted * usdPrice;

            const usdPricedTokenAmount: UsdPricedErc20TokenAmount = {
                amount: {
                    formatted,
                    raw,
                    usdValue,
                },
                token: {
                    address,
                    decimals,
                    name,
                    symbol,
                    usdPrice,
                },
            };

            if (!byChain[chainId])
                byChain[chainId] = {
                    chain: {
                        id: chainId,
                        name: chainData.name,
                        icon: chainData.icon,
                    },
                    tokens: [],
                    totalUsd: 0,
                };

            totalUsd += usdValue;
            byChain[chainId].totalUsd += usdValue;
            byChain[chainId].tokens.push(usdPricedTokenAmount);
        });

        return { totalUsd, claimableFees: byChain };
    }, [rawClaimableFees, tokens]);

    return {
        loading: loadingTokens || loadingClaimableFees,
        totalUsd,
        claimableFees,
    };
}
