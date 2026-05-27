import { zeroAddress, isAddress as isAddressViem } from "viem";
import { AccountAddress } from "@aptos-labs/ts-sdk";
import { ChainType } from "@metrom-xyz/sdk";
import { isAddress as isAddressSvm } from "@solana/kit";
import { getChainType } from "./chain";

export function shortenAddress(address?: string, long?: boolean) {
    if (!address) return "";

    const start = long ? 8 : 6;
    const end = long ? 8 : 4;

    if (address.length <= start + end) return address;

    return `${address.slice(0, start)}...${address.slice(-end)}`;
}

export function getColorFromAddress(address: string) {
    if (isZeroAddress(address)) return "#6b7280";

    let hash = 0;
    const cleanAddress = address.toLowerCase().replace(/^0x/, "");

    for (let i = 0; i < cleanAddress.length; i++) {
        hash = cleanAddress.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = Math.abs(hash) % 360;
    const saturation = 70 + (Math.abs(hash >> 8) % 25);
    const lightness = 55 + (Math.abs(hash >> 16) % 15);

    return hslToHex({ h: hue, s: saturation, l: lightness });
}

function hslToHex(hsl: { h: number; s: number; l: number }): string {
    const { h, s, l } = hsl;

    const hDecimal = l / 100;
    const a = (s * Math.min(hDecimal, 1 - hDecimal)) / 100;
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = hDecimal - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);

        return Math.round(255 * color)
            .toString(16)
            .padStart(2, "0");
    };

    return `#${f(0)}${f(8)}${f(4)}`;
}

export function isAddress(address: string): boolean {
    const chainType = getChainType();

    switch (chainType) {
        case ChainType.Evm:
            return isAddressViem(address);
        case ChainType.Aptos:
            return AccountAddress.isValid({ input: address, strict: true })
                .valid;
        case ChainType.Svm:
            return isAddressSvm(address);
        default:
            return false;
    }
}

export function isAddressOnChainType(
    address: string,
    chainType: ChainType,
): boolean {
    switch (chainType) {
        case ChainType.Evm:
            return isAddressViem(address);
        case ChainType.Aptos:
            return AccountAddress.isValid({ input: address, strict: true })
                .valid;
        case ChainType.Svm:
            return isAddressSvm(address);
        default:
            return false;
    }
}

export function isZeroAddress(address: string) {
    return (
        address === zeroAddress ||
        address === AccountAddress.from("0x0").toStringLong()
    );
}
