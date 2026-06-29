import {
    address,
    getBase64Encoder,
    getProgramDerivedAddress,
    type Address,
    type ReadonlyUint8Array,
} from "@solana/kit";
import { useSolanaClient } from "@solana/react-hooks";
import { useQuery } from "@tanstack/react-query";
import type { HookBaseParams } from "../types/hooks";
import type { Seed } from "../types/solana";

interface UseSolanaProgramAccountsParams extends HookBaseParams {
    programId?: string;
    seeds: Seed[][];
}

interface UseSolanaProgramAccountsReturnValue {
    loading: boolean;
    data?: ReadonlyUint8Array<ArrayBuffer>[];
}

export function useSolanaProgramAccounts({
    programId,
    seeds,
    enabled = true,
}: UseSolanaProgramAccountsParams): UseSolanaProgramAccountsReturnValue {
    const client = useSolanaClient();

    const { data: accounts, isLoading: loadingAccounts } = useQuery({
        queryKey: ["program-derived-addresses-account-info", programId, seeds],
        queryFn: async () => {
            if (!programId || seeds.length === 0) return [];

            try {
                const programAddress = address(programId) as Address;
                const programDerivedAddresses = await Promise.all(
                    seeds.map(async (accountSeeds) => {
                        const [programDerivedAddress] =
                            await getProgramDerivedAddress({
                                programAddress,
                                seeds: accountSeeds,
                            });

                        return programDerivedAddress;
                    }),
                );

                const accounts = await client.runtime.rpc
                    .getMultipleAccounts(programDerivedAddresses, {
                        encoding: "base64",
                    })
                    .send();

                return accounts.value.flatMap((value) => {
                    if (!value) return [];
                    return [getBase64Encoder().encode(value.data[0])];
                });
            } catch (error) {
                console.error(
                    `Could not fetch program accounts ${programId}: ${error}`,
                );
                throw error;
            }
        },
        enabled: enabled && !!programId && seeds.length > 0,
    });

    return {
        loading: loadingAccounts,
        data: accounts,
    };
}
