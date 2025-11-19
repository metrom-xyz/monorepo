import { type Activity } from "@metrom-xyz/sdk";
import { CHAIN_TYPE, METROM_API_CLIENT } from "../commons";
import { useQuery } from "@tanstack/react-query";
import type { Address } from "viem";
import type { HookBaseParams } from "../types/hooks";
import { useActiveChains } from "./useActiveChains";
import { useChainWithType } from "./useChainWithType";
import { useAccount } from "./useAccount";
import dayjs from "dayjs";

type UseActivitiesParams = HookBaseParams;
type QueryKey = [string, Address | undefined];

export interface GroupedActivities {
    timestamp: number;
    activities: Activity[];
}

const TIME_RANGE = 60 * 60 * 24 * 7; // 1 week

// TODO: dynamic from and to
export function useActivities({ enabled = true }: UseActivitiesParams = {}): {
    loading: boolean;
    activities: GroupedActivities[];
} {
    const { id: chainId } = useChainWithType();
    const activeChains = useActiveChains();
    const { address } = useAccount();

    const { data: activities, isLoading: loading } = useQuery({
        queryKey: ["activities", address, chainId],
        queryFn: async ({ queryKey }) => {
            const [, account] = queryKey as QueryKey;
            if (!account) return [];

            try {
                const to = Math.floor(Date.now() / 1000);
                const activities = await METROM_API_CLIENT.fetchActivities({
                    chainId,
                    chainType: CHAIN_TYPE,
                    address: account,
                    from: to - TIME_RANGE,
                    to,
                });

                const groupedActivities = activities.reduce(
                    (prev, curr) => {
                        const dayUnix = dayjs
                            .unix(curr.transaction.timestamp)
                            .startOf("day")
                            .unix();

                        if (!prev[dayUnix]) {
                            prev[dayUnix] = {
                                timestamp: dayUnix,
                                activities: [curr],
                            };
                            return prev;
                        }

                        const prevDayUnix = prev[dayUnix].timestamp;

                        if (
                            dayjs
                                .unix(dayUnix)
                                .isSame(dayjs.unix(prevDayUnix), "day")
                        )
                            prev[prevDayUnix].activities.push(curr);
                        else
                            prev[dayUnix] = {
                                timestamp: dayUnix,
                                activities: [curr],
                            };

                        return prev;
                    },
                    {} as Record<number, GroupedActivities>,
                );

                return Object.values(groupedActivities).sort(
                    (a, b) => b.timestamp - a.timestamp,
                );
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
