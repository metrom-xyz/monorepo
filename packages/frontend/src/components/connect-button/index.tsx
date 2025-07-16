import { APTOS } from "@/src/commons/env";
import { ConnectButtonMvm } from "./mvm";
import { ConnectButtonEvm } from "./evm";

export function ConnectButton() {
    if (APTOS) return <ConnectButtonMvm />;
    return <ConnectButtonEvm />;
}
