import { SupportedChain, type Activity } from "@metrom-xyz/sdk";
import { useEffect, useState } from "react";
import { metromApiClient } from "../commons";
import { useAccount, useChainId } from "wagmi";

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
                const activities = await metromApiClient.fetchActivities({
                    chainId,
                    address,
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
