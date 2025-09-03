import { type Address, zeroAddress, isAddress as isAddressViem } from "viem";
import { APTOS } from "../commons/env";
import { AccountAddress } from "@aptos-labs/ts-sdk";
import { ChainType } from "@metrom-xyz/sdk";

export function shortenAddress(address?: Address, long?: boolean) {
    if (!address) return "";

    const start = long ? 8 : 6;
    const end = long ? 8 : 4;

    if (address.length <= start + end) return address;

    return `${address.slice(0, start)}...${address.slice(-end)}`;
}

export function getColorFromAddress(address: Address) {
    if (address === zeroAddress) return "#D1D5DB";

    let hash = 0;
    const cleanAddress = address.toLowerCase().replace(/^0x/, "");

    for (let i = 0; i < cleanAddress.length; i++) {
        hash = cleanAddress.charCodeAt(i) + ((hash << 5) - hash);
    }

    return `#${(hash & 0x00ffffff).toString(16).padStart(6, "0")}`;
}

export function getAddressChainType(address: string): ChainType | undefined {
    if (isAddressViem(address)) return ChainType.Evm;
    if (AccountAddress.isValid({ input: address, strict: true }).valid)
        return ChainType.Aptos;

    return undefined;
}

export function isAddress(address: string): boolean {
    return (
        isAddressViem(address) ||
        AccountAddress.isValid({ input: address }).valid
    );
}
