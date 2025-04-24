import { Status, type Campaign, type KpiMeasurement } from "@metrom-xyz/sdk";
import { METROM_API_CLIENT } from "../commons";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import type { HookBaseParams } from "../types/hooks";

interface UseKpiMeasurementsParams extends HookBaseParams {
    from?: number;
    to?: number;
    campaign?: Campaign;
}

type QueryKey = [
    string,
    Campaign | undefined,
    number | undefined,
    number | undefined,
];

const MAX_DAYS_RANGE = 7;

export function useKpiMeasurements({
    from,
    to,
    campaign,
    enabled = true,
}: UseKpiMeasurementsParams = {}): {
    loading: boolean;
    kpiMeasurements: KpiMeasurement[];
} {
    const { data, isPending } = useQuery({
        queryKey: ["kpi-measurements", campaign, from, to],
        queryFn: async ({ queryKey }) => {
            const [, campaign, from, to] = queryKey as QueryKey;
            if (!campaign) return [];

            let derivedFrom = from;
            let derivedTo = to;

            if (!derivedFrom)
                derivedFrom =
                    campaign.status === Status.Ended
                        ? dayjs
                              .unix(campaign.to)
                              .utc()
                              .subtract(MAX_DAYS_RANGE, "days")
                              .unix()
                        : dayjs().utc().subtract(MAX_DAYS_RANGE, "days").unix();

            if (!derivedTo)
                derivedTo =
                    campaign.status === Status.Ended
                        ? dayjs.unix(campaign.to).utc().unix()
                        : dayjs().utc().unix();

            try {
                return METROM_API_CLIENT.fetchKpiMeasurements({
                    campaign,
                    from: derivedFrom,
                    to: derivedTo,
                });
            } catch (error) {
                console.error(
                    `Could not fetch KPI measurements for campaign with id ${campaign.id} in chain with id ${campaign.chainId}: ${error}`,
                );
                throw error;
            }
        },
        staleTime: 60000,
        enabled: enabled && !!campaign && !!campaign.specification?.kpi,
    });

    return {
        loading: isPending,
        kpiMeasurements: data || [],
    };
}
