import { RemoteLogo } from "./remote-logo";
import type { Address } from "viem";

interface AaveV3Props {
    address: Address;
    symbol: string;
    tokenUris: Record<Address, string>;
}

export function AaveV3({ address, symbol, tokenUris }: AaveV3Props) {
    return (
        <div tw="flex" style={{ gap: 18 }}>
            <div tw="flex">
                <RemoteLogo src={tokenUris[address]} />
            </div>
            <span tw="text-[42px]">{symbol}</span>
        </div>
    );
}
