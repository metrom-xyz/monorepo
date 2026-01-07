import { type Address, zeroAddress, isAddress as isAddressViem } from "viem";
import { AccountAddress } from "@aptos-labs/ts-sdk";
import { CHAIN_TYPE } from "../commons";
import { ChainType } from "@metrom-xyz/sdk";
import { Theme } from "@metrom-xyz/ui";

export function shortenAddress(address?: Address, long?: boolean) {
    if (!address) return "";

    const start = long ? 8 : 6;
    const end = long ? 8 : 4;

    if (address.length <= start + end) return address;

    return `${address.slice(0, start)}...${address.slice(-end)}`;
}

export function getColorFromAddress(address: Address, theme: Theme) {
    if (isZeroAddress(address))
        return theme === Theme.Light ? "#d1d5dc" : "#404040";

    let hash = 0;
    const cleanAddress = address.toLowerCase().replace(/^0x/, "");

    for (let i = 0; i < cleanAddress.length; i++) {
        hash = cleanAddress.charCodeAt(i) + ((hash << 5) - hash);
    }

    return `#${(hash & 0x00ffffff).toString(16).padStart(6, "0")}`;
}

export function isAddress(address: string): boolean {
    if (CHAIN_TYPE === ChainType.Aptos)
        return AccountAddress.isValid({ input: address, strict: true }).valid;
    if (CHAIN_TYPE === ChainType.Evm) return isAddressViem(address);
    return false;
}

export function isAddressOnChainType(
    address: string,
    chainType: ChainType,
): boolean {
    if (chainType === ChainType.Aptos)
        return AccountAddress.isValid({ input: address, strict: true }).valid;
    if (chainType === ChainType.Evm) return isAddressViem(address);
    return false;
}

export function isZeroAddress(address: string) {
    return (
        address === zeroAddress ||
        address === AccountAddress.from("0x0").toStringLong()
    );
}
