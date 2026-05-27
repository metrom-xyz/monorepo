import type { HookBaseParams } from "@/src/types/hooks";
import { APTOS } from "@/src/commons/env";
import { useChainData } from "./useChainData";
import { useAccount } from "./useAccount";
import { useReadContracts } from "wagmi";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import { getU32Decoder } from "@solana/kit";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useViewModule } from "@aptos-labs/react";
import { useMemo } from "react";
import { zeroAddress } from "viem";
import { chainIdToAptosNetwork } from "../utils/chain";
import { useChainType } from "./useChainType";
import { ChainType } from "@metrom-xyz/sdk";
import { useSolanaProgramAccount } from "./useSolanaProgramAccount";
import { useSolanaMetromProgramState } from "./useSolanaMetromProgramState";
import { useWalletConnection } from "@solana/react-hooks";

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
    const chainType = useChainType();
    const { address: addressEvm } = useAccount();
    const { account: accountMvm } = useWallet();
    const { wallet: accountSvm } = useWalletConnection();

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
        query: {
            enabled: chainType === ChainType.Evm && !!chainData && enabled,
        },
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
            chainType === ChainType.Aptos &&
            !!chainData &&
            enabled &&
            !!chainIdToAptosNetwork(chainId),
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

    const metromProgramState = useSolanaMetromProgramState({
        enabled: chainType === ChainType.Svm && !!chainData && enabled,
    });
    const rebateFeeSvm = useSolanaProgramAccount({
        programId: chainData?.metromContract.address,
        seeds: accountSvm ? ["fee_rebate", accountSvm.account.publicKey] : [],
        enabled:
            accountSvm && chainType === ChainType.Svm && !!chainData && enabled,
    });

    const loading =
        feesEvm.isLoading ||
        feeMvm.isLoading ||
        rebateFeeMvm.isLoading ||
        rebateFeeSvm.loading ||
        metromProgramState.loading;

    const fees: ProtocolFees | undefined = useMemo(() => {
        if (loading) return undefined;

        if (chainType === ChainType.Evm && feesEvm.data)
            return {
                fee:
                    feesEvm.data[0].result !== undefined
                        ? Number(feesEvm.data[0].result)
                        : undefined,
                feeRebate:
                    feesEvm.data[1].result !== undefined
                        ? Number(feesEvm.data[1].result)
                        : 0,
            };
        if (chainType === ChainType.Aptos && feeMvm.data)
            return {
                fee: Number(feeMvm.data[0]),
                feeRebate: rebateFeeMvm.data ? Number(rebateFeeMvm.data[0]) : 0,
            };
        if (chainType === ChainType.Svm && metromProgramState.data) {
            return {
                fee: metromProgramState.data.fee,
                // TODO: is rebate null if no rebate or 0?
                feeRebate: rebateFeeSvm.data
                    ? getU32Decoder().decode(rebateFeeSvm.data)
                    : 0,
            };
        }

        return undefined;
    }, [
        loading,
        chainType,
        feesEvm.data,
        feeMvm.data,
        rebateFeeMvm.data,
        metromProgramState.data,
        rebateFeeSvm.data,
    ]);

    return {
        loading,
        ...fees,
    };
}
