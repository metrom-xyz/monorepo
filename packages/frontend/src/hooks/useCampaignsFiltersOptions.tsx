import { ChainType, Status } from "@metrom-xyz/sdk";
import type { SelectOption } from "@metrom-xyz/ui";
import { useMemo } from "react";
import { getCrossVmChainData } from "../utils/chain";
import { useTranslations } from "next-intl";
import { useChainsWithTypes } from "./useChainsWithTypes";
import { useSupportedProtocols } from "./useSupportedProtocols";
import { useChainType } from "./useChainType";

export interface ChainFilterOption {
    label: string;
    value: string;
    query: string;
}

export function useCampaignsFiltersOptions() {
    const t = useTranslations("allCampaigns.filters");
    const chainType = useChainType();
    const supportedChains = useChainsWithTypes({
        chainType: chainType === ChainType.Aptos ? ChainType.Aptos : undefined,
    });
    const supportedProtocols = useSupportedProtocols({
        crossVm: chainType !== ChainType.Aptos,
    });

    const statusOptions: SelectOption<Status>[] = useMemo(
        () => [
            {
                label: t("status.live"),
                value: Status.Active,
            },
            {
                label: t("status.upcoming"),
                value: Status.Upcoming,
            },
            {
                label: t("status.ended"),
                value: Status.Expired,
            },
        ],
        [t],
    );

    const protocolOptions: SelectOption<string>[] = useMemo(() => {
        return supportedProtocols.map((protocol) => ({
            label: protocol.name,
            protocol,
            value: protocol.slug,
        }));
    }, [supportedProtocols]);

    const chainOptions: ChainFilterOption[] = useMemo(() => {
        const options: ChainFilterOption[] = [];

        for (const chain of supportedChains) {
            const chainData = getCrossVmChainData(chain.id, chain.type);
            if (!chainData) continue;

            options.push({
                label: chainData.name,
                value: `${chain.type}_${chain.id}`,
                query: chainData.name.toLowerCase().replaceAll(" ", "_"),
            });
        }
        return options;
    }, [supportedChains]);

    return { statusOptions, protocolOptions, chainOptions };
}
