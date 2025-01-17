import { metromApiClient } from "../commons";
import { Campaign } from "@metrom-xyz/sdk";
import { useQuery } from "@tanstack/react-query";

export function useCampaigns(): {
    loading: boolean;
    campaigns?: Campaign[];
} {
    const { data: campaigns, isPending: loading } = useQuery({
        queryKey: ["campaigns"],
        queryFn: async () => {
            try {
                return await metromApiClient.fetchCampaigns();
            } catch (error) {
                throw new Error(`Could not fetch campaigns: ${error}`);
            }
        },
    });

    return {
        loading,
        campaigns,
    };
}
