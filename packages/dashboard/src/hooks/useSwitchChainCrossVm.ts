import { useCallback } from "react";
import { useSwitchChain } from "wagmi";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Network } from "@aptos-labs/ts-sdk";
import { ChainType } from "@metrom-xyz/sdk";
import { chainIdToAptosNetwork } from "../utils/chain";
import { useChainType } from "../context/chain-type";

export function useSwitchChainCrossVm() {
    const { chainType } = useChainType();
    const { switchChain: switchChainEvm } = useSwitchChain();
    const { changeNetwork: changeNetworkMvm, connected: connectedMvm } =
        useWallet();

    return useCallback(
        (chainId: number) => {
            switch (chainType) {
                case ChainType.Evm: {
                    switchChainEvm(
                        { chainId },
                        {
                            onError: (err) => {
                                console.error(`Could not switch chain: ${err}`);
                            },
                        },
                    );
                    break;
                }
                case ChainType.Aptos: {
                    const network = chainIdToAptosNetwork(chainId);
                    if (!network || !connectedMvm) return;

                    changeNetworkMvm(network as string as Network).catch(
                        (error) => {
                            console.error(
                                `Could not switch Aptos network: ${error}`,
                            );
                        },
                    );
                    break;
                }
                default:
                    throw new Error(`Unsupported chain type: ${chainType}`);
            }
        },
        [chainType, connectedMvm, changeNetworkMvm, switchChainEvm],
    );
}
