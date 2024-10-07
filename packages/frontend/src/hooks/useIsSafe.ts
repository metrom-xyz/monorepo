import { useConnectors } from "wagmi";
import { SAFE_CONNECTOR_ID } from "../commons";

export function useIsSafe() {
    const connectors = useConnectors();

    return !!connectors.find((connector) => connector.id === SAFE_CONNECTOR_ID);
}
