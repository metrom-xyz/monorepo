import type { Address } from "viem";

export interface UseAccountReturnValue {
    address?: Address;
    chainId?: number;
    connected: boolean;
}
