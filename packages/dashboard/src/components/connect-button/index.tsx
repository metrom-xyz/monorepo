"use client";

import { ChainType } from "@metrom-xyz/sdk";
import { useChainType } from "@/context/chain-type";
import { ConnectButtonMvm } from "./mvm";
import { ConnectButtonEvm } from "./evm";

export function ConnectButton() {
    const { chainType } = useChainType();

    switch (chainType) {
        case ChainType.Aptos:
            return <ConnectButtonMvm />;
        case ChainType.Evm:
            return <ConnectButtonEvm />;
        default:
            throw new Error(`Unsupported chain type: ${chainType}`);
    }
}
