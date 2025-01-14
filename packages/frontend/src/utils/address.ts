import { type Address } from "viem";

export function shortenAddress(address?: Address, long?: boolean) {
    if (!address) return "";

    return long
        ? `${address.slice(0, 10)}...${address.substring(34)}`
        : `${address.slice(0, 6)}...${address.substring(38)}`;
}
