import { type UseEnsAvatarParameters } from "wagmi";
import { getEnsAvatar } from "@wagmi/core";
import { useQuery } from "@tanstack/react-query";
import { mainnet } from "viem/chains";
import { useChainType } from "../context/chain-type";
import { ChainType } from "@metrom-xyz/sdk";
import { mainnetWagmiConfig } from "../context/rainbow-kit";

export function useAccountAvatar(params: UseEnsAvatarParameters) {
    const { chainType } = useChainType();

    const data = useQuery({
        queryKey: ["ens-avatar", params.name],
        queryFn: async () => {
            try {
                const { name, ...rest } = params;
                if (!name) return null;

                // TODO: implement for Aptos and Solana
                if (chainType !== ChainType.Evm) return null;

                return await getEnsAvatar(params.config || mainnetWagmiConfig, {
                    name,
                    ...rest,
                    chainId: mainnet.id,
                });
            } catch (error) {
                console.error(`Could not get account avatar`, error);
            }
        },
    });

    return data;
}
