import type { SupportedChain } from "@metrom-xyz/contracts";
import { useChainId } from "wagmi";
import { metromApiClient } from "../commons";
import { useEffect, useState } from "react";
import type { WhitelistedErc20Token } from "@metrom-xyz/sdk";

enum WhitelistedTokenType {
    Rewards,
    Fees,
}

function useWhitelistedTokens(type: WhitelistedTokenType): {
    loading: boolean;
    whitelistedTokens: WhitelistedErc20Token[];
} {
    const chainId: SupportedChain = useChainId();

    const [whitelistedTokens, setWhitelistedTokens] = useState<
        WhitelistedErc20Token[]
    >([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function fetchData() {
            if (!cancelled) setLoading(false);
            if (!cancelled) setWhitelistedTokens([]);

            try {
                if (!cancelled) setLoading(true);
                const tokens =
                    type === WhitelistedTokenType.Rewards
                        ? await metromApiClient.fetchWhitelistedRewardTokens({
                              chainId,
                          })
                        : await metromApiClient.fetchWhitelistedFeeTokens({
                              chainId,
                          });
                if (!cancelled) setWhitelistedTokens(tokens);
            } catch (error) {
                console.error(`Could not fetch whitelisted tokens: ${error}`);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        fetchData();
        return () => {
            cancelled = true;
        };
    }, [chainId, type]);

    return {
        loading,
        whitelistedTokens,
    };
}

export function useWhitelistedRewardTokens(): {
    loading: boolean;
    whitelistedTokens: WhitelistedErc20Token[];
} {
    return useWhitelistedTokens(WhitelistedTokenType.Rewards);
}

export function useWhitelistedFeeTokens(): {
    loading: boolean;
    whitelistedTokens: WhitelistedErc20Token[];
} {
    return useWhitelistedTokens(WhitelistedTokenType.Fees);
}
