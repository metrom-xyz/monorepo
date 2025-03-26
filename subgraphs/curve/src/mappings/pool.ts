import {
    AddLiquidity,
    AddLiquidity1,
    AddLiquidity2,
    AddLiquidity3,
    AddLiquidity4,
    AddLiquidity5,
    AddLiquidity6,
    AddLiquidity7,
    AddLiquidity8,
    TokenExchange,
    TokenExchange1,
    TokenExchange2,
    RemoveLiquidity,
    RemoveLiquidity1,
    RemoveLiquidity2,
    RemoveLiquidity3,
    RemoveLiquidity4,
    RemoveLiquidity5,
    RemoveLiquidityOne,
    RemoveLiquidityOne1,
    RemoveLiquidityOne2,
    TokenExchangeUnderlying,
    RemoveLiquidityImbalance,
    RemoveLiquidityImbalance1,
    RemoveLiquidityImbalance2,
    RemoveLiquidityImbalance3,
} from "../../generated/templates/UnifiedPool/UnifiedPool";
import {
    Address,
    BigInt,
    Bytes,
    dataSource,
    ethereum,
} from "@graphprotocol/graph-ts";
import {
    getEventId,
    getOrCreatePosition,
    BI_0,
    getOrCreatePool,
    getPoolOrThrow,
    updateTokenTvls,
} from "../commons";
import { LiquidityChange } from "../../generated/schema";

function handleSwap(event: ethereum.Event): void {
    let basePoolAddress: Address | null = null;
    let context = dataSource.context();
    if (context.isSet("base-pool-address")) {
        // this is for standalone pools in the manifest, as those have the base
        // pool hardcoded in the manifest itself
        basePoolAddress = changetype<Address>(
            context.getBytes("base-pool-address"),
        );
    }
    let pool = getOrCreatePool(event.address, null, basePoolAddress);

    if (pool.base !== null) {
        let basePool = getPoolOrThrow(changetype<Address>(pool.base));

        updateTokenTvls(event.block.number, basePool);
        basePool.save();
    }

    updateTokenTvls(event.block.number, pool);
    pool.save();
}

function handleLiquidityChange(
    event: ethereum.Event,
    provider: Address,
    liquiditySupply: BigInt | null,
    absoluteLiquidityDelta: BigInt | null,
    remove: bool,
): void {
    let basePoolAddress: Address | null = null;
    let context = dataSource.context();
    if (context.isSet("base-pool-address")) {
        // this is for standalone pools in the manifest, as those have the base
        // pool hardcoded in the manifest itself
        basePoolAddress = changetype<Address>(
            context.getBytes("base-pool-address"),
        );
    }

    let pool = getOrCreatePool(event.address, null, basePoolAddress);

    let liquidityDelta = BI_0;
    if (liquiditySupply !== null) {
        liquidityDelta = liquiditySupply.minus(pool.liquidity);
    } else if (absoluteLiquidityDelta) {
        liquidityDelta = remove
            ? absoluteLiquidityDelta.neg()
            : absoluteLiquidityDelta;
    } else
        throw new Error(
            `No liquidity supply nor liquidity delta provided when processing liquidity change event on pool ${pool.id.toHex()}`,
        );

    pool.liquidity = pool.liquidity.plus(liquidityDelta);
    if (pool.liquidity.isZero()) {
        let tvls: BigInt[] = [];
        for (let i = 0; i < pool.tokens.length; i++) tvls.push(BI_0);
        pool.tvls = tvls;
    } else {
        updateTokenTvls(event.block.number, pool);
    }
    pool.save();

    if (liquidityDelta.isZero()) return;

    let position = getOrCreatePosition(event.address, provider);
    position.liquidity = position.liquidity.plus(liquidityDelta);
    position.save();

    let liquidityChange = new LiquidityChange(getEventId(event));
    liquidityChange.timestamp = event.block.timestamp;
    liquidityChange.blockNumber = event.block.number;
    liquidityChange.delta = liquidityDelta;
    liquidityChange.position = position.id;
    liquidityChange.save();
}

export function handleStableSwapTokenExchange(event: TokenExchange): void {
    handleSwap(event);
}

export function handleCryptoSwapTokenExchange(event: TokenExchange1): void {
    handleSwap(event);
}

export function handleCryptoSwapNgTokenExchange(event: TokenExchange2): void {
    handleSwap(event);
}

export function handleStableSwapTokenExchangeUnderlying(
    event: TokenExchangeUnderlying,
): void {
    handleSwap(event);
}

export function handleStableSwapAddLiquidity2(event: AddLiquidity): void {
    handleLiquidityChange(
        event,
        event.params.provider,
        event.params.token_supply,
        null,
        false,
    );
}

export function handleStableSwapAddLiquidity3(event: AddLiquidity1): void {
    handleLiquidityChange(
        event,
        event.params.provider,
        event.params.token_supply,
        null,
        false,
    );
}

export function handleStableSwapAddLiquidity4(event: AddLiquidity2): void {
    handleLiquidityChange(
        event,
        event.params.provider,
        event.params.token_supply,
        null,
        false,
    );
}

export function handleStableSwapNgAddLiquidity(event: AddLiquidity3): void {
    handleLiquidityChange(
        event,
        event.params.provider,
        event.params.token_supply,
        null,
        false,
    );
}

export function handleCryptoSwapAddLiquidity2(event: AddLiquidity4): void {
    handleLiquidityChange(
        event,
        event.params.provider,
        event.params.token_supply,
        null,
        false,
    );
}

export function handleCryptoSwapAddLiquidity3(event: AddLiquidity5): void {
    handleLiquidityChange(
        event,
        event.params.provider,
        event.params.token_supply,
        null,
        false,
    );
}

export function handleCryptoSwapAddLiquidity4(event: AddLiquidity6): void {
    handleLiquidityChange(
        event,
        event.params.provider,
        event.params.token_supply,
        null,
        false,
    );
}

export function handleCryptoSwapNgAddLiquidity2(event: AddLiquidity7): void {
    handleLiquidityChange(
        event,
        event.params.provider,
        event.params.token_supply,
        null,
        false,
    );
}

export function handleCryptoSwapNgAddLiquidity3(event: AddLiquidity8): void {
    handleLiquidityChange(
        event,
        event.params.provider,
        event.params.token_supply,
        null,
        false,
    );
}

export function handleStableSwapRemoveLiquidity2(event: RemoveLiquidity): void {
    handleLiquidityChange(
        event,
        event.params.provider,
        event.params.token_supply,
        null,
        true,
    );
}

export function handleStableSwapRemoveLiquidity3(
    event: RemoveLiquidity1,
): void {
    handleLiquidityChange(
        event,
        event.params.provider,
        event.params.token_supply,
        null,
        true,
    );
}

export function handleStableSwapRemoveLiquidity4(
    event: RemoveLiquidity2,
): void {
    handleLiquidityChange(
        event,
        event.params.provider,
        event.params.token_supply,
        null,
        true,
    );
}

export function handleStableSwapNgRemoveLiquidity(
    event: RemoveLiquidity3,
): void {
    handleLiquidityChange(
        event,
        event.params.provider,
        event.params.token_supply,
        null,
        true,
    );
}

export function handleCryptoSwapRemoveLiquidity2(
    event: RemoveLiquidity4,
): void {
    handleLiquidityChange(
        event,
        event.params.provider,
        event.params.token_supply,
        null,
        true,
    );
}

export function handleCryptoSwapRemoveLiquidity3(
    event: RemoveLiquidity5,
): void {
    handleLiquidityChange(
        event,
        event.params.provider,
        event.params.token_supply,
        null,
        true,
    );
}

export function handleStableSwapRemoveLiquidityOne(
    event: RemoveLiquidityOne,
): void {
    handleLiquidityChange(
        event,
        event.params.provider,
        null,
        event.params.token_amount,
        true,
    );
}

export function handleStableSwapNgRemoveLiquidityOne(
    event: RemoveLiquidityOne1,
): void {
    handleLiquidityChange(
        event,
        event.params.provider,
        event.params.token_supply,
        null,
        true,
    );
}

export function handleCryptoSwapNgRemoveLiquidityOne(
    event: RemoveLiquidityOne2,
): void {
    let absoluteTvlDeltas: BigInt[] = [];
    for (let i = 0; i < event.params.coin_index.toI32(); i++)
        absoluteTvlDeltas.push(BI_0);
    absoluteTvlDeltas.push(event.params.coin_amount);

    handleLiquidityChange(
        event,
        event.params.provider,
        null,
        event.params.token_amount,
        true,
    );
}

export function handleStableSwapRemoveLiquidityImbalance2(
    event: RemoveLiquidityImbalance,
): void {
    handleLiquidityChange(
        event,
        event.params.provider,
        event.params.token_supply,
        null,
        true,
    );
}

export function handleStableSwapRemoveLiquidityImbalance3(
    event: RemoveLiquidityImbalance1,
): void {
    handleLiquidityChange(
        event,
        event.params.provider,
        event.params.token_supply,
        null,
        true,
    );
}

export function handleStableSwapRemoveLiquidityImbalance4(
    event: RemoveLiquidityImbalance2,
): void {
    handleLiquidityChange(
        event,
        event.params.provider,
        event.params.token_supply,
        null,
        true,
    );
}

export function handleStableSwapNgRemoveLiquidityImbalance(
    event: RemoveLiquidityImbalance3,
): void {
    handleLiquidityChange(
        event,
        event.params.provider,
        event.params.token_supply,
        null,
        true,
    );
}
