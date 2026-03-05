import { ConnectButtonMvm } from "./mvm";
import { ConnectButtonEvm } from "./evm";
import { APTOS } from "@/commons/env";

export function ConnectButton() {
    if (APTOS) return <ConnectButtonMvm />;
    return <ConnectButtonEvm />;
}
