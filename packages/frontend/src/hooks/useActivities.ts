import { SupportedChain, type Activity } from "@metrom-xyz/sdk";
import { useEffect, useState } from "react";
import { metromApiClient } from "../commons";
import { useAccount, useChainId } from "wagmi";

const TIME_RANGE = 60 * 60 * 60 * 24 * 7; // 1 week

// TODO: dynamic from and to
export function useActivities(): {
    loading: boolean;
    activities: Activity[];
} {
    const chainId: SupportedChain = useChainId();
    const { address } = useAccount();

    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function fetchData() {
            if (!cancelled) setLoading(false);
            if (!cancelled) setActivities([]);

            if (!chainId || !address) return;

            try {
                if (!cancelled) setLoading(true);

                const to = Math.floor(Date.now() / 1000);
                const activities = await metromApiClient.fetchActivities({
                    chainId,
                    address,
                    from: to - TIME_RANGE,
                    to,
                });

                if (!cancelled) setActivities(activities);
            } catch (error) {
                console.error(
                    `Could not fetch activity for address ${address} in chain id ${chainId}: ${error}`,
                );
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        fetchData();
        return () => {
            cancelled = true;
        };
    }, [address, chainId]);

    return {
        loading,
        activities,
    };
}
