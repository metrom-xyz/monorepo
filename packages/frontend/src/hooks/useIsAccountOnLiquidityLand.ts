import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { type Address } from "viem";
import type { HookBaseParams } from "../types/hooks";

interface UseIsAccountOnLiquidityLandProps extends HookBaseParams {
    endpoint?: string;
}

interface UseIsAccountOnLiquidityLandReturnaValue {
    loading: boolean;
    active?: boolean;
}

interface LiquidityLandActivitiesResponse {
    walletAddress: Address;
    totalValueUsd: number;
    date: string;
}

type QueryKey = [string, Address, string];

export function useIsAccountOnLiquidityLand({
    endpoint,
    enabled,
}: UseIsAccountOnLiquidityLandProps): UseIsAccountOnLiquidityLandReturnaValue {
    const { address } = useAccount();

    const { data: active, isLoading: loading } = useQuery({
        queryKey: ["liquidity-land-activities", address, endpoint],
        queryFn: async ({ queryKey }) => {
            const [, address, endpoint] = queryKey as QueryKey;

            if (!address || !endpoint) return false;

            try {
                const response = await fetch(endpoint);

                if (!response.ok)
                    throw new Error(
                        `Could not fetch liquidity land activities: ${await response.text()}`,
                    );

                const activities =
                    (await response.json()) as LiquidityLandActivitiesResponse[];

                return !!activities.find(
                    ({ walletAddress }) =>
                        walletAddress.toLowerCase() === address.toLowerCase(),
                );
            } catch (error) {
                console.error(`Could not fetch fee tokens: ${error}`);
                throw error;
            }
        },
        enabled,
    });

    return { loading, active };
}
