import { useWalletConnection } from "@solana/react-hooks";
import { useChainData } from "../useChainData";
import { useSolanaMetromProgramState } from "../useSolanaMetromProgramState";
import { useSolanaProgramAccount } from "../useSolanaProgramAccount";
import { getFeeRebateDecoder } from "@metrom-xyz/programs-solana/client";
import { useMemo } from "react";
import type { UseProtocolFeesParams, UseProtocolFeesReturnValue } from ".";

export function useProtocolFeesSvm({
    chainId,
    enabled = true,
}: UseProtocolFeesParams = {}): UseProtocolFeesReturnValue {
    const chainData = useChainData({ chainId });
    const { wallet } = useWalletConnection();

    const metromProgramState = useSolanaMetromProgramState({
        enabled: !!chainData && enabled,
    });
    const rebateFeeSvm = useSolanaProgramAccount({
        programId: chainData?.metromContract.address,
        seeds: wallet ? ["fee_rebate", wallet.account.publicKey] : [],
        enabled: !!wallet && !!chainData && enabled,
    });

    const fees = useMemo(() => {
        if (metromProgramState.loading || rebateFeeSvm.loading) return undefined;
        if (!metromProgramState.data) return undefined;
        return {
            fee: metromProgramState.data.fee,
            feeRebate: rebateFeeSvm.data
                ? getFeeRebateDecoder().decode(rebateFeeSvm.data).rebate
                : 0,
        };
    }, [
        metromProgramState.data,
        metromProgramState.loading,
        rebateFeeSvm.data,
        rebateFeeSvm.loading,
    ]);

    return {
        loading: metromProgramState.loading || rebateFeeSvm.loading,
        ...fees,
    };
}
