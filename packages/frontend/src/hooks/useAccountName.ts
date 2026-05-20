import { type UseEnsNameParameters } from "wagmi";
import { useConfig } from "wagmi";
import { getEnsName } from "@wagmi/core";
import { useQuery } from "@tanstack/react-query";
import { useChainType } from "./useChainType";
import { ChainType } from "@metrom-xyz/sdk";

export function useAccountName(params: UseEnsNameParameters) {
    const config = useConfig();
    const chainType = useChainType();

    const data = useQuery({
        queryKey: ["account-name", params.address],
        queryFn: async () => {
            try {
                const { address, ...rest } = params;
                if (!address) return null;

                // TODO: implement for Aptos and Solana
                if (chainType !== ChainType.Evm) return null;

                return await getEnsName(params.config || config, {
                    ...rest,
                    address,
                });
            } catch (error) {
                console.error(`Could not get account name`, error);
                throw error;
            }
        },
        retry: false,
    });

    return data;
}
