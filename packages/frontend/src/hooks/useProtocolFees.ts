import type { HookBaseParams } from "@/src/types/hooks";
import { APTOS } from "@/src/commons/env";
import { useChainData } from "./useChainData";
import { useAccount } from "./useAccount";
import { useReadContracts } from "wagmi";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useViewModule } from "@aptos-labs/react";
import { useMemo } from "react";
import { zeroAddress } from "viem";
import { chainIdToAptosNetwork } from "../utils/chain";

export interface UseProtocolFeesParams extends HookBaseParams {
    chainId?: number;
}

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
    chainId,
    enabled,
}: UseProtocolFeesParams = {}): UseProtocolFeesReturnValue {
    const chainData = useChainData({ chainId });
    const { address: addressEvm } = useAccount();
    const { account: accountMvm } = useWallet();

    const addressMvm = accountMvm?.address.toString();

    const feesEvm = useReadContracts({
        contracts: [
            {
                abi: metromAbi,
                chainId,
                address: chainData?.metromContract.address,
                functionName: "fee",
            },
            {
                abi: metromAbi,
                chainId,
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
        network: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            network: chainIdToAptosNetwork(chainId) as any,
        },
        enabled:
            APTOS && !!chainData && enabled && !!chainIdToAptosNetwork(chainId),
    });

    const rebateFeeMvm = useViewModule({
        payload: {
            function: `${chainData?.metromContract.address}::metrom::fee_rebate`,
            functionArguments: [addressMvm],
        },
        network: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            network: chainIdToAptosNetwork(chainId) as any,
        },
        enabled:
            APTOS &&
            !!chainData &&
            !!addressMvm &&
            enabled &&
            !!chainIdToAptosNetwork(chainId),
    });

    const loading =
        feesEvm.isLoading || feeMvm.isLoading || rebateFeeMvm.isLoading;

    const fees: ProtocolFees | undefined = useMemo(() => {
        if (loading) return undefined;

        if (APTOS && feeMvm.data)
            return {
                fee: Number(feeMvm.data[0]),
                feeRebate: rebateFeeMvm.data ? Number(rebateFeeMvm.data[0]) : 0,
            };
        if (!APTOS && feesEvm.data) {
            return {
                fee:
                    feesEvm.data[0].result !== undefined
                        ? Number(feesEvm.data[0].result)
                        : undefined,
                feeRebate:
                    feesEvm.data[1].result !== undefined
                        ? Number(feesEvm.data[1].result)
                        : undefined,
            };
        }

        return undefined;
    }, [loading, feesEvm.data, feeMvm.data, rebateFeeMvm.data]);

    return {
        loading,
        ...fees,
    };
}
