import { useChainData } from "../useChainData";
import { useChainId } from "../useChainId";
import { useViewModule } from "@aptos-labs/react";
import type { UseProtocolFeesParams, UseProtocolFeesReturnValue } from ".";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

export function useProtocolFeesMvm({
    enabled = true,
}: UseProtocolFeesParams = {}): UseProtocolFeesReturnValue {
    const chainId = useChainId();
    const chainData = useChainData({ chainId });
    const { account } = useWallet();

    const address = account?.address.toStringLong();

    const { data: rawFee, isLoading: loadingFee } = useViewModule({
        payload: {
            function: `${chainData?.metromContract.address}::metrom::fee`,
        },
        enabled: enabled && !!chainData,
    });

    const { data: rawFeeRebate, isLoading: loadingFeeRebate } = useViewModule({
        payload: {
            function: `${chainData?.metromContract.address}::metrom::fee_rebate`,
            functionArguments: [address],
        },
        enabled: enabled && !!chainData && !!address,
    });

    const fee = rawFee?.[0] !== undefined ? Number(rawFee?.[0]) : undefined;
    const feeRebate =
        rawFeeRebate?.[0] !== undefined ? Number(rawFeeRebate?.[0]) : undefined;

    return {
        loading: loadingFee || loadingFeeRebate,
        fee,
        feeRebate,
    };
}
