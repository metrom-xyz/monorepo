import { type UseEnsNameParameters } from "wagmi";
import { useConfig } from "wagmi";
import { getEnsName } from "@wagmi/core";
import { useQuery } from "@tanstack/react-query";
import { APTOS } from "../commons/env";

export function useAccountName(params: UseEnsNameParameters) {
    const config = useConfig();

    const data = useQuery({
        queryKey: ["account-name", params.address],
        queryFn: async () => {
            try {
                const { address, ...rest } = params;
                if (!address) return null;

                // TODO: implement for Aptos
                if (APTOS) return null;

                return await getEnsName(params.config || config, {
                    ...rest,
                    address,
                });
            } catch (error) {
                console.error(`Could not get account name`, error);
            }
        },
    });

    return data;
}
