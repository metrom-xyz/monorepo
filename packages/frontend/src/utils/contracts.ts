import type { SimulateContractErrorType } from "@wagmi/core";

export function retryContractSimulationEvm(
    failureCount: number,
    error: SimulateContractErrorType,
): boolean {
    if (error.name === "ContractFunctionExecutionError" || failureCount >= 3)
        return false;
    return true;
}
