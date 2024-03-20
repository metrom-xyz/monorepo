import type { Address } from "viem";

export const shortenAddress = (address?: Address) => {
    return address ? `${address.slice(0, 6)}...${address.substring(38)}` : "";
};
