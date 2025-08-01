import { type Activity } from "@metrom-xyz/sdk";
import { SupportedChain } from "@metrom-xyz/contracts";
import { METROM_API_CLIENT } from "../commons";
import { useAccount, useChainId } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import type { Address } from "viem";
import type { HookBaseParams } from "../types/hooks";
import { useActiveChains } from "./useActiveChains";

interface UseActivitiesParams extends HookBaseParams {}

type QueryKey = [string, Address | undefined];

const TIME_RANGE = 60 * 60 * 24 * 7; // 1 week

// TODO: dynamic from and to
export function useActivities({ enabled = true }: UseActivitiesParams = {}): {
    loading: boolean;
    activities: Activity[];
} {
    const chainId = useChainId();
    const activeChains = useActiveChains();
    const { address } = useAccount();

    const { data: activities, isPending: loading } = useQuery({
        queryKey: ["activities", address, chainId],
        queryFn: async ({ queryKey }) => {
            const [, account] = queryKey as QueryKey;
            if (!account) return [];

            try {
                const to = Math.floor(Date.now() / 1000);
                const activities = await METROM_API_CLIENT.fetchActivities({
                    chainId,
                    address: account,
                    from: to - TIME_RANGE,
                    to,
                });

                return activities;
            } catch (error) {
                console.error(
                    `Could not fetch activity for address ${address} in chain id ${chainId}: ${error}`,
                );
                throw error;
            }
        },
        enabled:
            enabled &&
            !!chainId &&
            !!address &&
            !!activeChains.find(({ id }) => id === chainId),
    });

    return {
        loading,
        activities: activities || [],
    };
}
