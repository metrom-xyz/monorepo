import { Address } from "@graphprotocol/graph-ts";
import {
    TokenExchange as TokenExchangeEvent,
    AddLiquidity as AddLiquidityEvent,
    RemoveLiquidity as RemoveLiquidityEvent,
    RemoveLiquidityOne as RemoveLiquidityOneEvent,
    RemoveLiquidityImbalance as RemoveLiquidityImbalanceEvent,
} from "../../generated/templates/Pool/Pool";
import {
    BD_0,
    BI_0,
    BI_1,
    convertTokenToDecimal,
    getTokenOrThrow,
    createBaseEventEvent,
    getOrCreatePosition,
    getPoolOrThrow,
    getPositionOrThrow,
} from "../commons";

export function handleTokenExchange(event: TokenExchangeEvent): void {
    let pool = getPoolOrThrow(event.address);

    let token0 = getTokenOrThrow(Address.fromBytes(pool.token0));
    let token1 = getTokenOrThrow(Address.fromBytes(pool.token1));
    let token2 = getTokenOrThrow(Address.fromBytes(pool.token2));

    if (event.params.bought_id == BI_0) {
        pool.token0Tvl = pool.token0Tvl.minus(
            convertTokenToDecimal(
                event.params.tokens_bought,
                Address.fromBytes(token0.id),
            ),
        );
    } else if (event.params.bought_id == BI_1) {
        pool.token1Tvl = pool.token1Tvl.minus(
            convertTokenToDecimal(
                event.params.tokens_bought,
                Address.fromBytes(token1.id),
            ),
        );
    } else {
        pool.token2Tvl = pool.token2Tvl.minus(
            convertTokenToDecimal(
                event.params.tokens_bought,
                Address.fromBytes(token2.id),
            ),
        );
    }

    if (event.params.sold_id == BI_0) {
        pool.token0Tvl = pool.token0Tvl.plus(
            convertTokenToDecimal(
                event.params.tokens_sold,
                Address.fromBytes(token0.id),
            ),
        );
    } else if (event.params.sold_id == BI_1) {
        pool.token1Tvl = pool.token1Tvl.plus(
            convertTokenToDecimal(
                event.params.tokens_sold,
                Address.fromBytes(token1.id),
            ),
        );
    } else {
        pool.token2Tvl = pool.token2Tvl.plus(
            convertTokenToDecimal(
                event.params.tokens_sold,
                Address.fromBytes(token2.id),
            ),
        );
    }

    pool.save();
}

export function handleAddLiquidity(event: AddLiquidityEvent): void {
    let pool = getPoolOrThrow(event.address);
    let addedLiquidity = event.params.token_supply.minus(pool.liquidity);
    if (addedLiquidity.isZero()) {
        return;
    }

    let amount0 = convertTokenToDecimal(
        event.params.token_amounts[0],
        Address.fromBytes(pool.token0),
    );
    let amount1 = convertTokenToDecimal(
        event.params.token_amounts[1],
        Address.fromBytes(pool.token1),
    );
    let amount2 = convertTokenToDecimal(
        event.params.token_amounts[2],
        Address.fromBytes(pool.token2),
    );

    pool.token0Tvl = pool.token0Tvl.plus(amount0);
    pool.token1Tvl = pool.token1Tvl.plus(amount1);
    pool.token2Tvl = pool.token2Tvl.plus(amount2);
    pool.liquidity = event.params.token_supply;
    pool.save();

    let position = getOrCreatePosition(event.address, event.params.provider);
    position.liquidity = position.liquidity.plus(addedLiquidity);
    position.save();

    let nonZeroLiquidityChange = createBaseEventEvent(event, position.pool);
    nonZeroLiquidityChange.liquidityDelta = addedLiquidity;
    nonZeroLiquidityChange.position = position.id;
    nonZeroLiquidityChange.save();
}

export function handleRemoveLiquidity(event: RemoveLiquidityEvent): void {
    let pool = getPoolOrThrow(event.address);
    let removedLiquidity = pool.liquidity.minus(event.params.token_supply);
    if (removedLiquidity.isZero()) {
        return;
    }

    let amount0 = convertTokenToDecimal(
        event.params.token_amounts[0],
        Address.fromBytes(pool.token0),
    );
    let amount1 = convertTokenToDecimal(
        event.params.token_amounts[1],
        Address.fromBytes(pool.token1),
    );
    let amount2 = convertTokenToDecimal(
        event.params.token_amounts[2],
        Address.fromBytes(pool.token2),
    );

    pool.token0Tvl = pool.token0Tvl.minus(amount0);
    pool.token1Tvl = pool.token1Tvl.minus(amount1);
    pool.token2Tvl = pool.token1Tvl.minus(amount2);
    pool.liquidity = event.params.token_supply;
    pool.save();

    let position = getPositionOrThrow(event.address, event.params.provider);
    position.liquidity = position.liquidity.minus(removedLiquidity);
    position.save();

    let nonZeroLiquidityChange = createBaseEventEvent(event, position.pool);
    nonZeroLiquidityChange.liquidityDelta = removedLiquidity.neg();
    nonZeroLiquidityChange.position = position.id;
    nonZeroLiquidityChange.save();
}

export function handleRemoveLiquidityOne(event: RemoveLiquidityOneEvent): void {
    if (event.params.token_amount.isZero()) {
        return;
    }

    let pool = getPoolOrThrow(event.address);

    let removedAmount0 =
        event.params.index === BI_0
            ? convertTokenToDecimal(
                  event.params.coin_amount,
                  Address.fromBytes(pool.token0),
              )
            : BD_0;
    let removedAmount1 =
        event.params.index === BI_0
            ? BD_0
            : convertTokenToDecimal(
                  event.params.coin_amount,
                  Address.fromBytes(pool.token1),
              );
    let removedAmount2 =
        event.params.index === BI_1
            ? BD_0
            : convertTokenToDecimal(
                  event.params.coin_amount,
                  Address.fromBytes(pool.token2),
              );

    pool.token0Tvl = pool.token0Tvl.minus(removedAmount0);
    pool.token1Tvl = pool.token1Tvl.minus(removedAmount1);
    pool.token2Tvl = pool.token2Tvl.minus(removedAmount2);
    pool.liquidity = pool.liquidity.minus(event.params.token_amount);
    pool.save();

    let position = getPositionOrThrow(event.address, event.params.provider);
    position.liquidity = position.liquidity.minus(event.params.token_amount);
    position.save();

    let nonZeroLiquidityChange = createBaseEventEvent(event, position.pool);
    nonZeroLiquidityChange.liquidityDelta = event.params.token_amount.neg();
    nonZeroLiquidityChange.position = position.id;
    nonZeroLiquidityChange.save();
}

export function handleRemoveLiquidityImbalance(
    event: RemoveLiquidityImbalanceEvent,
): void {
    let pool = getPoolOrThrow(event.address);
    let removedLiquidity = pool.liquidity.minus(event.params.token_supply);
    if (removedLiquidity.isZero()) {
        return;
    }

    let amount0 = convertTokenToDecimal(
        event.params.token_amounts[0],
        Address.fromBytes(pool.token0),
    );
    let amount1 = convertTokenToDecimal(
        event.params.token_amounts[1],
        Address.fromBytes(pool.token1),
    );
    let amount2 = convertTokenToDecimal(
        event.params.token_amounts[2],
        Address.fromBytes(pool.token2),
    );

    pool.token0Tvl = pool.token0Tvl.minus(amount0);
    pool.token1Tvl = pool.token1Tvl.minus(amount1);
    pool.token2Tvl = pool.token2Tvl.minus(amount2);
    pool.liquidity = event.params.token_supply;
    pool.save();

    let position = getPositionOrThrow(event.address, event.params.provider);
    position.liquidity = position.liquidity.minus(removedLiquidity);
    position.save();

    let nonZeroLiquidityChange = createBaseEventEvent(event, position.pool);
    nonZeroLiquidityChange.liquidityDelta = removedLiquidity.neg();
    nonZeroLiquidityChange.position = position.id;
    nonZeroLiquidityChange.save();
}
