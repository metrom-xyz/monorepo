import { useCurrentAccount, useCurrentClient } from "@mysten/dapp-kit-react";
import { useChainData } from "../useChainData";
import { useQuery } from "@tanstack/react-query";
import { Transaction } from "@mysten/sui/transactions";
import { bcs } from "@mysten/sui/bcs";
import { fee, feeRebate } from "@metrom-xyz/sui-contracts/client";
import type { UseProtocolFeesParams, UseProtocolFeesReturnValue } from ".";

export function useProtocolFeesSui({
    chainId,
    enabled = true,
}: UseProtocolFeesParams = {}): UseProtocolFeesReturnValue {
    const chainData = useChainData({ chainId });
    const client = useCurrentClient();
    const account = useCurrentAccount();

    const { data: fees, isLoading } = useQuery({
        queryKey: ["protocol-fees-sui", chainId, chainData, account?.address],
        queryFn: async () => {
            if (
                !chainData?.metromContract.address ||
                !chainData.metromContract.stateAddress
            )
                return null;

            const tx = new Transaction();

            fee({
                package: chainData.metromContract.address,
                arguments: { state: chainData.metromContract.stateAddress },
            })(tx);

            if (account?.address) {
                feeRebate({
                    package: chainData.metromContract.address,
                    arguments: {
                        state: chainData.metromContract.stateAddress,
                        account: account.address,
                    },
                })(tx);
            }

            const result = await client.simulateTransaction({
                transaction: tx,
                checksEnabled: false,
                include: { commandResults: true },
            });

            const feeBytes = result.commandResults?.[0]?.returnValues?.[0]?.bcs;
            const rebateBytes =
                result.commandResults?.[1]?.returnValues?.[0]?.bcs;

            return {
                fee: feeBytes ? Number(bcs.u32().parse(feeBytes)) : undefined,
                feeRebate: rebateBytes
                    ? Number(bcs.u32().parse(rebateBytes))
                    : 0,
            };
        },
        enabled: !!chainData?.metromContract.stateAddress && enabled,
    });

    return {
        loading: isLoading,
        ...fees,
    };
}
