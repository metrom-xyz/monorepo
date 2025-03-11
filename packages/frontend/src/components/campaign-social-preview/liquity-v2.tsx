import type { Erc20Token } from "@metrom-xyz/sdk";
import { RemoteLogo } from "./remote-logo";
import type { Address } from "viem";

interface LiquityV2Props {
    collateral: Erc20Token;
    tokenUris: Record<Address, string>;
}

export function LiquityV2({ collateral, tokenUris }: LiquityV2Props) {
    return (
        <div tw="flex items-center" style={{ gap: 18 }}>
            <div tw="flex">
                <RemoteLogo src={tokenUris[collateral.address]} />
            </div>
            <span tw="text-[42px]">{collateral.symbol}</span>
        </div>
    );
}
