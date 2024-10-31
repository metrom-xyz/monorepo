import { type Campaign, type KpiMeasurement } from "@metrom-xyz/sdk";
import { metromApiClient } from "../commons";
import { useQuery } from "@tanstack/react-query";

const TIME_RANGE = 60 * 60 * 4; // 4 hours

// TODO: dynamic from and to
export function useKpiMeasurements(campaign?: Campaign): {
    loading: boolean;
    kpiMeasurements: KpiMeasurement[];
} {
    const { data, isPending } = useQuery({
        queryKey: ["kpi-measurements", campaign],
        queryFn: async ({ queryKey }) => {
            const campaign = queryKey[1] as Campaign;
            if (!campaign) return [];

            try {
                const to = Math.floor(Date.now() / 1000);
                return metromApiClient.fetchKpiMeasurements({
                    campaign,
                    from: to - TIME_RANGE,
                    to,
                });
            } catch (error) {
                throw new Error(
                    `Could not fetch KPI measurements for campaign with id ${campaign.id} in chain with id ${campaign.chainId}: ${error}`,
                );
            }
        },
        enabled: !!campaign && !!campaign.specification?.kpi,
    });

    return {
        loading: isPending,
        kpiMeasurements: data || [],
    };
}
