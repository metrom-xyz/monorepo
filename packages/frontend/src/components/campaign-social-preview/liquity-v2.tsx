import { RemoteLogo } from "./remote-logo";
import type { Address } from "viem";

interface LiquityV2Props {
    address: Address;
    symbol: string;
    tokenUris: Record<Address, string>;
}

export function LiquityV2({ address, symbol, tokenUris }: LiquityV2Props) {
    return (
        <div tw="flex" style={{ gap: 18 }}>
            <div tw="flex">
                <RemoteLogo src={tokenUris[address]} />
            </div>
            <span tw="text-[42px]">{symbol}</span>
        </div>
    );
}
