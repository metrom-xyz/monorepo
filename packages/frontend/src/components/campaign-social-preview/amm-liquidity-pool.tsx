import type { AmmPool } from "@metrom-xyz/sdk";
import { RemoteLogo } from "./remote-logo";
import type { Address } from "viem";

interface AmmLiquidityPoolProps {
    pool: AmmPool;
    tokenUris: Record<Address, string>;
}

export function AmmLiquidityPool({ pool, tokenUris }: AmmLiquidityPoolProps) {
    return (
        <div tw="flex" style={{ gap: 18 }}>
            <div tw="relative flex" style={{ gap: 1 }}>
                {pool.tokens.map(({ address }, index) => (
                    <RemoteLogo
                        key={index}
                        src={tokenUris[address]}
                        style={{ marginLeft: index * -12 }}
                    />
                ))}
            </div>
            <span tw="text-[42px]">
                {pool.tokens.map(({ symbol }) => symbol).join("/")}
            </span>
        </div>
    );
}
