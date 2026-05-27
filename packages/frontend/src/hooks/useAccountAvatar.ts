import { type UseEnsAvatarParameters } from "wagmi";
import { useConfig } from "wagmi";
import { getEnsAvatar } from "@wagmi/core";
import { useQuery } from "@tanstack/react-query";
import { useChainType } from "./useChainType";
import { ChainType } from "@metrom-xyz/sdk";

export function useAccountAvatar(params: UseEnsAvatarParameters) {
    const chainType = useChainType();
    const config = useConfig();

    const data = useQuery({
        queryKey: ["ens-avatar", params.name],
        queryFn: async () => {
            try {
                const { name, ...rest } = params;
                if (!name) return null;

                // TODO: implement for Aptos and Solana
                if (chainType !== ChainType.Evm) return null;

                return await getEnsAvatar(params.config || config, {
                    name,
                    ...rest,
                });
            } catch (error) {
                console.error(`Could not get account avatar`, error);
            }
        },
    });

    return data;
}
