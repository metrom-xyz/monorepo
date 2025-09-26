import type { AaveV3Collateral } from "@metrom-xyz/sdk";
import { RemoteLogo } from "./remote-logo";
import type { Address } from "viem";

interface AaveV3Props {
    collateral: AaveV3Collateral;
    tokenUris: Record<Address, string>;
}

export function AaveV3({ collateral, tokenUris }: AaveV3Props) {
    return (
        <div tw="flex" style={{ gap: 18 }}>
            <div tw="flex">
                <RemoteLogo src={tokenUris[collateral.token.address]} />
            </div>
            <span tw="text-[42px]">{collateral.token.symbol}</span>
        </div>
    );
}
