import {
    address,
    type ReadonlyUint8Array,
    getBase64Encoder,
} from "@solana/kit";
import { useSolanaProgramDerivedAddress } from "./useSolanaProgramDerivedAddress";
import { useSolanaClient } from "@solana/react-hooks";
import type { HookBaseParams } from "../types/hooks";
import { useQuery } from "@tanstack/react-query";

type Seed = ReadonlyUint8Array | string;

interface UseSolanaProgramAccountParams extends HookBaseParams {
    programId?: string;
    seeds: Seed[];
}

interface UseSolanaProgramAccountReturnValue {
    loading: boolean;
    data?: ReadonlyUint8Array<ArrayBuffer> | null;
}

export function useSolanaProgramAccount({
    programId,
    seeds,
    enabled = true,
}: UseSolanaProgramAccountParams): UseSolanaProgramAccountReturnValue {
    const client = useSolanaClient();
    const {
        data: programDerivedAddress,
        loading: loadingProgramDerivedAddress,
    } = useSolanaProgramDerivedAddress({
        programId,
        seeds,
        enabled,
    });

    const { data: accountInfoData, isLoading: loadingAccountInfo } = useQuery({
        queryKey: [
            "program-derived-address-account-info",
            programId,
            programDerivedAddress,
        ],
        queryFn: async () => {
            if (!programId || !programDerivedAddress) return null;

            try {
                const claimedRewardsAccounts = await client.runtime.rpc
                    .getAccountInfo(address(programDerivedAddress), {
                        encoding: "base64",
                    })
                    .send();

                if (!claimedRewardsAccounts.value) return null;

                return getBase64Encoder().encode(
                    claimedRewardsAccounts.value.data[0],
                );
            } catch (error) {
                console.error(
                    `Could not fetch program account ${programId}: ${error}`,
                );
                throw error;
            }
        },
        enabled: enabled && !!programDerivedAddress,
    });

    return {
        loading: loadingProgramDerivedAddress || loadingAccountInfo,
        data: accountInfoData,
    };
}
