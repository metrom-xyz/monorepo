import { APTOS } from "@/src/commons/env";
import { ConnectButtonMvm } from "./mvm";
import { ConnectButtonEvm } from "./evm";
import type { ReactElement } from "react";

export interface ConnectButtonProps {
    customComponent?: ReactElement<{ onClick: () => void }>;
}

export function ConnectButton(props: ConnectButtonProps) {
    if (APTOS) return <ConnectButtonMvm {...props} />;
    return <ConnectButtonEvm {...props} />;
}
