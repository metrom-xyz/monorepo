import {
    fixDecoderSize,
    getAddressDecoder,
    getBytesDecoder,
    getOptionDecoder,
    getStructDecoder,
    getU32Decoder,
    getU8Decoder,
    type Address,
    type Option,
    type ReadonlyUint8Array,
} from "@solana/kit";
import type { HookBaseParams } from "../types/hooks";
import { useSolanaProgramAccount } from "./useSolanaProgramAccount";
import { PROGRAM_ID } from "@metrom-xyz/programs-solana";
import { ChainType } from "@metrom-xyz/sdk";
import { useChainWithType } from "./useChainWithType";
import { useChainData } from "./useChainData";
import { useMemo } from "react";

const stateDecoder = getStructDecoder([
    ["discriminator", fixDecoderSize(getBytesDecoder(), 8)],
    ["owner", getAddressDecoder()],
    [
        "pendingOwner",
        getOptionDecoder(getAddressDecoder(), { prefix: getU8Decoder() }),
    ],
    ["updater", getAddressDecoder()],
    ["fee", getU32Decoder()],
    ["minimumCampaignDuration", getU32Decoder()],
    ["maximumCampaignDuration", getU32Decoder()],
]);

interface UseSolanaMetromProgramStateParams extends HookBaseParams {
    enabled?: boolean;
}

interface UseSolanaMetromProgramStateReturnValue {
    loading: boolean;
    data: {
        discriminator: ReadonlyUint8Array;
        owner: Address;
        updater: Address;
        pendingOwner: Option<Address>;
        minimumCampaignDuration: number;
        fee: number;
        maximumCampaignDuration: number;
    } | null;
}

export function useSolanaMetromProgramState({
    enabled = true,
}: UseSolanaMetromProgramStateParams): UseSolanaMetromProgramStateReturnValue {
    const { id: chainId, type: chainType } = useChainWithType();
    const chainData = useChainData({ chainId });

    const rawState = useSolanaProgramAccount({
        programId: PROGRAM_ID.toString(),
        seeds: ["state"],
        enabled: chainType === ChainType.Svm && !!chainData && enabled,
    });

    const data = useMemo(
        () => (rawState.data ? stateDecoder.decode(rawState.data) : null),
        [rawState.data],
    );

    return {
        loading: rawState.loading,
        data,
    };
}
