import type { HookBaseParams } from "@/src/types/hooks";
import { APTOS } from "@/src/commons/env";
import { useChainId } from "./useChainId";
import { useChainData } from "./useChainData";
import { useAccount } from "./useAccount";
import { useReadContracts } from "wagmi";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useViewModule } from "@aptos-labs/react";
import { useMemo } from "react";
import { zeroAddress } from "viem";

export interface UseProtocolFeesParams extends HookBaseParams {}

export interface ProtocolFees {
    fee?: number;
    feeRebate?: number;
}

export interface UseProtocolFeesReturnValue {
    loading: boolean;
    fee?: number;
    feeRebate?: number;
}

export function useProtocolFees({
    enabled,
}: UseProtocolFeesParams = {}): UseProtocolFeesReturnValue {
    const chainId = useChainId();
    const chainData = useChainData({ chainId });
    const { address: addressEvm } = useAccount();
    const { account: accountMvm } = useWallet();

    const addressMvm = accountMvm?.address.toString();

    const feesEvm = useReadContracts({
        contracts: [
            {
                abi: metromAbi,
                address: chainData?.metromContract.address,
                functionName: "fee",
            },
            {
                abi: metromAbi,
                address: chainData?.metromContract.address,
                functionName: "feeRebate",
                args: [addressEvm || zeroAddress],
            },
        ],
        query: { enabled: !APTOS && !!chainData && enabled },
    });

    const feeMvm = useViewModule({
        payload: {
            function: `${chainData?.metromContract.address}::metrom::fee`,
        },
        enabled: APTOS && !!chainData && enabled,
    });

    const rebateFeeMvm = useViewModule({
        payload: {
            function: `${chainData?.metromContract.address}::metrom::fee_rebate`,
            functionArguments: [addressMvm],
        },
        enabled: APTOS && !!chainData && !!addressMvm && enabled,
    });

    const loading =
        feesEvm.isLoading || feeMvm.isLoading || rebateFeeMvm.isLoading;

    console.log({ feesEvm });

    const fees: ProtocolFees | undefined = useMemo(() => {
        if (loading) return undefined;

        if (APTOS && feeMvm.data && rebateFeeMvm.data)
            return {
                fee: Number(feeMvm.data[0]),
                feeRebate: Number(rebateFeeMvm.data[0]),
            };
        if (!APTOS && feesEvm.data)
            return {
                fee: Number(feesEvm.data[0].result),
                feeRebate: Number(feesEvm.data[1].result),
            };

        return undefined;
    }, [loading, feesEvm.data, feeMvm.data, rebateFeeMvm.data]);

    return {
        loading,
        ...fees,
    };
}
