import { RemoteLogo } from "./remote-logo";
import type { Address } from "viem";

interface HoldFungibleAssetProps {
    address: Address;
    symbol: string;
    tokenUris: Record<Address, string>;
}

export function HoldFungibleAsset({
    address,
    symbol,
    tokenUris,
}: HoldFungibleAssetProps) {
    return (
        <div tw="flex" style={{ gap: 18 }}>
            <div tw="flex">
                <RemoteLogo src={tokenUris[address]} />
            </div>
            <span tw="text-[42px]">{symbol}</span>
        </div>
    );
}
