import { APTOS } from "@/src/commons/env";
import { NetworkSelectMvm } from "./network-select-mvm";
import { NetworkSelectEvm } from "./network-select-evm";

export function NetworkSelect() {
    if (APTOS) return <NetworkSelectMvm />;
    return <NetworkSelectEvm />;
}
