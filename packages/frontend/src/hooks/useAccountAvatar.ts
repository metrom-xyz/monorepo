import { type UseEnsAvatarParameters } from "wagmi";
import { useConfig } from "wagmi";
import { getEnsAvatar } from "@wagmi/core";
import { useQuery } from "@tanstack/react-query";
import { APTOS } from "../commons/env";

export function useAccountAvatar(params: UseEnsAvatarParameters) {
    const config = useConfig();

    const data = useQuery({
        queryKey: ["ens-avatar", params.name],
        queryFn: async () => {
            try {
                const { name, ...rest } = params;
                if (!name) return null;

                // TODO: implement for Aptos
                if (APTOS) return null;

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
