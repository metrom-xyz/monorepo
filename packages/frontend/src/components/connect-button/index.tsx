import { ConnectButtonMvm } from "./mvm";
import { ConnectButtonEvm } from "./evm";
import type { ReactElement } from "react";
import { ConnectButtonSvm } from "./svm";
import { ConnectButtonSui } from "./sui";
import { useChainType } from "@/src/hooks/useChainType";
import { ChainType } from "@metrom-xyz/sdk";

export interface ConnectButtonProps {
    customComponent?: ReactElement<{ onClick: () => void }>;
}

export function ConnectButton(props: ConnectButtonProps) {
    const chainType = useChainType();

    switch (chainType) {
        case ChainType.Evm:
            return <ConnectButtonEvm {...props} />;
        case ChainType.Aptos:
            return <ConnectButtonMvm {...props} />;
        case ChainType.Svm:
            return <ConnectButtonSvm {...props} />;
        case ChainType.Sui:
            return <ConnectButtonSui {...props} />;
        default:
            return null;
    }
}
