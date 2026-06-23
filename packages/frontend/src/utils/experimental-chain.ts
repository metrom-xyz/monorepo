import {
    AmmPoolDepositUrlType,
    ProtocolType,
    SupportedDex,
    type DexProtocol,
} from "@metrom-xyz/chains";
import { EmptyIcon } from "../assets/empty-icon";
import {
    AmmPoolLiquidityType,
    ChainType,
    SupportedAmm,
    type AmmPool,
} from "@metrom-xyz/sdk";

export function generatePlaceholderDexProtocol(): DexProtocol {
    return {
        active: true,
        type: ProtocolType.Dex,
        slug: SupportedDex.UniswapV4,
        logo: EmptyIcon,
        name: "Placeholder",
        depositUrl: {
            type: AmmPoolDepositUrlType.PathPoolAddress,
            template: "",
        },
        supportsFetchAllPools: true,
    };
}

export function generatePlaceholderPool(
    chainId: number,
    chainType: ChainType,
): AmmPool {
    return {
        chainId: chainId,
        chainType: chainType,
        id: "0x0000000000000000000000000000000000000000",
        dex: generatePlaceholderDexProtocol(),
        amm: SupportedAmm.UniswapV4,
        tokens: [
            {
                address: "0x0000000000000000000000000000000000000000",
                symbol: "PLHDR",
                name: "Placeholder",
                decimals: 18,
            },
            {
                address: "0x0000000000000000000000000000000000000001",
                symbol: "PLHDR",
                name: "Placeholder",
                decimals: 18,
            },
        ],
        liquidityType: AmmPoolLiquidityType.Concentrated,
        liquidity: 1000000n,
        usdTvl: 1000000,
    };
}
