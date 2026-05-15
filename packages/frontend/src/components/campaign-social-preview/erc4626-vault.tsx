import { RemoteLogo } from "./remote-logo";
import type { Address } from "viem";

interface Erc4626VaultProps {
    address: Address;
    name: string;
    tokenUris: Record<Address, string>;
}

export function Erc4626Vault({
    address,
    name,
    tokenUris,
}: Erc4626VaultProps) {
    return (
        <div tw="flex" style={{ gap: 18 }}>
            <div tw="flex">
                <RemoteLogo src={tokenUris[address]} />
            </div>
            <span tw="text-[42px]">{name}</span>
        </div>
    );
}
