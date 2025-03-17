import { Status, type Campaign, type KpiMeasurement } from "@metrom-xyz/sdk";
import { METROM_API_CLIENT } from "../commons";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

const MAX_DAYS_RANGE = 7;

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

            const from =
                campaign.status === Status.Ended
                    ? dayjs
                          .unix(campaign.to)
                          .utc()
                          .subtract(MAX_DAYS_RANGE, "days")
                          .unix()
                    : dayjs().utc().subtract(MAX_DAYS_RANGE, "days").unix();

            const to =
                campaign.status === Status.Ended
                    ? dayjs.unix(campaign.to).utc().unix()
                    : dayjs().utc().unix();

            try {
                return METROM_API_CLIENT.fetchKpiMeasurements({
                    campaign,
                    from,
                    to,
                });
            } catch (error) {
                console.error(
                    `Could not fetch KPI measurements for campaign with id ${campaign.id} in chain with id ${campaign.chainId}: ${error}`,
                );
                throw error;
            }
        },
        enabled: !!campaign && !!campaign.specification?.kpi,
    });

    return {
        loading: isPending,
        kpiMeasurements: data || [],
    };
}
