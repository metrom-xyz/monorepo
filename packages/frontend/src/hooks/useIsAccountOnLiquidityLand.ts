import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { type Address } from "viem";
import type { HookBaseParams } from "../types/hooks";
import { LV2_SERVICE_BASE_URLS } from "../commons/lv2-points";
import { ENVIRONMENT } from "../commons/env";
import type { SupportedLiquityV2 } from "@metrom-xyz/sdk";
import type { Lv2BackendLiquidityLandUsersResponse } from "../types/lv2-points-campaign";

interface UseIsAccountOnLiquidityLandProps extends HookBaseParams {
    protocol?: SupportedLiquityV2;
}

interface UseIsAccountOnLiquidityLandReturnaValue {
    loading: boolean;
    active?: boolean;
}

type QueryKey = [string, Address, SupportedLiquityV2];

export function useIsAccountOnLiquidityLand({
    protocol,
    enabled,
}: UseIsAccountOnLiquidityLandProps): UseIsAccountOnLiquidityLandReturnaValue {
    const { address } = useAccount();

    const { data: active, isLoading: loading } = useQuery({
        queryKey: ["liquidity-land-activities", address, protocol],
        queryFn: async ({ queryKey }) => {
            const [, address, protocol] = queryKey as QueryKey;

            if (!address || !protocol) return false;

            try {
                const url = new URL(
                    "/api/v1/liquidity-land/users",
                    LV2_SERVICE_BASE_URLS[ENVIRONMENT](protocol),
                );

                const response = await fetch(url);
                if (!response.ok)
                    throw new Error(
                        `response not ok while fetching lv2 points campaign liquidity land users: ${await response.text()}`,
                    );

                const { accounts } =
                    (await response.json()) as Lv2BackendLiquidityLandUsersResponse;

                return !!accounts.find(
                    (account) =>
                        account.toLowerCase() === address.toLowerCase(),
                );
            } catch (error) {
                console.error(
                    `Could not fetch lv2 points campaign liquidity land users: ${error}`,
                );
                throw error;
            }
        },
        enabled: enabled && !!address,
    });

    return { loading, active };
}
