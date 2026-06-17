import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useViewModule } from "@aptos-labs/react";
import { useChainData } from "../useChainData";
import { chainIdToAptosNetwork } from "../../utils/chain";
import { useMemo } from "react";
import type { UseProtocolFeesParams, UseProtocolFeesReturnValue } from ".";

export function useProtocolFeesMvm({
    chainId,
    enabled = true,
}: UseProtocolFeesParams = {}): UseProtocolFeesReturnValue {
    const chainData = useChainData({ chainId });
    const { account } = useWallet();

    const aptosNetwork = chainIdToAptosNetwork(chainId);

    const feeMvm = useViewModule({
        payload: {
            function: `${chainData?.metromContract.address}::metrom::fee`,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        network: { network: aptosNetwork as any },
        enabled: !!chainData && !!aptosNetwork && enabled,
    });

    const rebateFeeMvm = useViewModule({
        payload: {
            function: `${chainData?.metromContract.address}::metrom::fee_rebate`,
            functionArguments: [account?.address.toString()],
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        network: { network: aptosNetwork as any },
        enabled:
            !!chainData && !!aptosNetwork && !!account?.address && enabled,
    });

    const fees = useMemo(() => {
        if (feeMvm.isLoading || rebateFeeMvm.isLoading) return undefined;
        if (!feeMvm.data) return undefined;
        return {
            fee: Number(feeMvm.data[0]),
            feeRebate: rebateFeeMvm.data ? Number(rebateFeeMvm.data[0]) : 0,
        };
    }, [
        feeMvm.data,
        feeMvm.isLoading,
        rebateFeeMvm.data,
        rebateFeeMvm.isLoading,
    ]);

    return {
        loading: feeMvm.isLoading || rebateFeeMvm.isLoading,
        ...fees,
    };
}
