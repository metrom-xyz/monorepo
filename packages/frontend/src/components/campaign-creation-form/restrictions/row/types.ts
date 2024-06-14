import type { Address } from "viem";

export interface RestrictionRowProps {
    address: Address;
    onRemove: () => void;
}
