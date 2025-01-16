import type { SupportedChain } from "@metrom-xyz/contracts";
import { useChainId } from "wagmi";
import { metromApiClient } from "../commons";
import { useEffect, useState } from "react";
import type { RewardToken } from "@metrom-xyz/sdk";

export function useRewardTokens(): {
    loading: boolean;
    tokens: RewardToken[];
} {
    const chainId: SupportedChain = useChainId();

    const [tokens, setTokens] = useState<RewardToken[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function fetchData() {
            if (!cancelled) setLoading(false);
            if (!cancelled) setTokens([]);

            try {
                if (!cancelled) setLoading(true);
                const tokens = await metromApiClient.fetchRewardTokens({
                    chainId,
                });
                if (!cancelled) setTokens(tokens);
            } catch (error) {
                console.error(`Could not fetch reward tokens: ${error}`);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        fetchData();
        return () => {
            cancelled = true;
        };
    }, [chainId]);

    return {
        loading,
        tokens,
    };
}
