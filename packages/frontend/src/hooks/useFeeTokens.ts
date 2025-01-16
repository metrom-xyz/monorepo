import type { SupportedChain } from "@metrom-xyz/contracts";
import { useChainId } from "wagmi";
import { metromApiClient } from "../commons";
import { useEffect, useState } from "react";
import type { FeeToken } from "@metrom-xyz/sdk";

export function useFeeTokens(): {
    loading: boolean;
    tokens: FeeToken[];
} {
    const chainId: SupportedChain = useChainId();

    const [tokens, setTokens] = useState<FeeToken[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function fetchData() {
            if (!cancelled) setLoading(false);
            if (!cancelled) setTokens([]);

            try {
                if (!cancelled) setLoading(true);
                const tokens = await metromApiClient.fetchFeeTokens({
                    chainId,
                });
                if (!cancelled) setTokens(tokens);
            } catch (error) {
                console.error(`Could not fetch fee tokens: ${error}`);
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
