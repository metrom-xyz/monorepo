import { SERVICE_URLS } from "@metrom-xyz/sdk";
import { useQuery } from "@tanstack/react-query";
import { ENVIRONMENT } from "../commons/env";
import type { HookBaseParams } from "../types/hooks";

interface UseCampaignSetupParams extends HookBaseParams {
    hash?: string | null;
}

export function useCampaignSetup({ hash, enabled }: UseCampaignSetupParams): {
    loading: boolean;
    error?: boolean;
    setup?: string;
} {
    const {
        data: setup,
        isLoading: loading,
        isError: error,
    } = useQuery({
        queryKey: ["temporary-data", hash],
        queryFn: async () => {
            try {
                const response = await fetch(
                    `${SERVICE_URLS[ENVIRONMENT].dataManager}/data?hash=${hash}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    },
                );

                if (!response.ok) throw new Error(await response.text());

                const setup = await response.json();
                if (!setup.kind)
                    throw new Error(
                        `Unsupported campaign setup with hash ${hash}: missing kind`,
                    );

                return JSON.stringify(setup);
            } catch (error) {
                console.error(`Could not fetch campaign setup: ${error}`);
                throw error;
            }
        },
        enabled: enabled && !!hash,
        refetchOnWindowFocus: false,
    });

    return { loading, error, setup };
}
