import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { type Address } from "viem";
import type { HookBaseParams } from "../types/hooks";
import type { BoostedAccountsResponse } from "../types/boosted-accounts";
import type {
    SupportedPointsBooster,
    SupportedProtocol,
} from "@metrom-xyz/sdk";
import { DYNAMIC_POINTS_BASE_SERVICE_URLS } from "../commons/dynamic-points";
import { ENVIRONMENT } from "../commons/env";

interface useIsAccountBoostedProps extends HookBaseParams {
    protocol?: SupportedProtocol;
    booster?: SupportedPointsBooster;
}

interface useIsAccountBoostedReturnValue {
    loading: boolean;
    active?: boolean;
}

type QueryKey = [
    string,
    Address,
    SupportedProtocol | undefined,
    SupportedPointsBooster | undefined,
];

export function useIsAccountBoosted({
    protocol,
    booster,
    enabled,
}: useIsAccountBoostedProps): useIsAccountBoostedReturnValue {
    const { address } = useAccount();

    const { data: active, isLoading: loading } = useQuery({
        queryKey: ["is-account-boosted", address, protocol, booster],
        queryFn: async ({ queryKey }) => {
            const [, address, protocol, booster] = queryKey as QueryKey;

            if (!address || !protocol || !booster) return false;
            if (!DYNAMIC_POINTS_BASE_SERVICE_URLS[ENVIRONMENT](protocol))
                return false;

            try {
                const url = new URL(
                    "/api/v1/liquidity-land/users",
                    DYNAMIC_POINTS_BASE_SERVICE_URLS[ENVIRONMENT](protocol),
                );

                const response = await fetch(url);
                if (!response.ok)
                    throw new Error(
                        `response not ok while fetching boosted accounts: ${await response.text()}`,
                    );

                const { accounts } =
                    (await response.json()) as BoostedAccountsResponse;

                return !!accounts.find(
                    (account) =>
                        account.toLowerCase() === address.toLowerCase(),
                );
            } catch (error) {
                console.error(`Could not fetch boosted accounts: ${error}`);
                throw error;
            }
        },
        enabled: enabled && !!address,
    });

    return { loading, active };
}
