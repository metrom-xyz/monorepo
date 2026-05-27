import {
    address,
    getProgramDerivedAddress,
    type Address,
    type ReadonlyUint8Array,
} from "@solana/kit";
import type { HookBaseParams } from "../types/hooks";
import { useQuery } from "@tanstack/react-query";

type Seed = ReadonlyUint8Array | string;

interface UseSolanaProgramDerivedAddressParams extends HookBaseParams {
    programId?: string;
    seeds: Seed[];
}

interface UseSolanaProgramDerivedAddressReturnValue {
    data?: string;
    loading: boolean;
    error?: Error;
}

export function useSolanaProgramDerivedAddress({
    programId,
    seeds,
    enabled = true,
}: UseSolanaProgramDerivedAddressParams): UseSolanaProgramDerivedAddressReturnValue {
    const { data, isLoading } = useQuery({
        queryKey: ["solana-program-derived-address", programId, seeds],
        queryFn: async () => {
            if (!programId) return null;

            try {
                const [pda] = await getProgramDerivedAddress({
                    programAddress: address(programId) as Address,
                    seeds,
                });

                return pda;
            } catch (error) {
                console.error(
                    `Could not get solana program derived address for program id ${programId} and seeds ${seeds}: ${error}`,
                );
                throw error;
            }
        },
        enabled: enabled && !!programId,
    });

    return {
        data: data || undefined,
        loading: isLoading,
    };
}
