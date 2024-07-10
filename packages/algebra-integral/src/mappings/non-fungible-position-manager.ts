import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
    IncreaseLiquidity as IncreaseLiquidityEvent,
    DecreaseLiquidity as DecreaseLiquidityEvent,
    Transfer as TransferEvent,
} from "../../generated/NonFungiblePositionManager/NonFungiblePositionManager";
import { Position } from "../../generated/schema";
import {
    BI_0,
    FactoryContract,
    NonFungiblePositionManagerContract,
    createBaseEvent,
    getPoolOrThrow,
} from "../commons";

function getNftPositionId(tokenId: BigInt): Bytes {
    return Bytes.fromByteArray(Bytes.fromBigInt(tokenId));
}

function getOrCreateNftPosition(tokenId: BigInt): Position | null {
    let id = getNftPositionId(tokenId);
    let position = Position.load(id);
    if (position != null) return position;

    let result = NonFungiblePositionManagerContract.try_positions(tokenId);

    // the following call reverts in situations where the position is minted
    // and deleted in the same block - from my investigation this happens
    // in calls from  BancorSwap
    // (e.g. 0xf7867fa19aa65298fadb8d4f72d0daed5e836f3ba01f0b9b9631cdc6c36bed40)
    if (result.reverted) return null;

    let poolAddress = FactoryContract.poolByPair(
        result.value.getToken0(),
        result.value.getToken1(),
    );

    position = new Position(id);
    position.owner = NonFungiblePositionManagerContract.ownerOf(tokenId);
    position.lowerTick = BigInt.fromI32(result.value.getTickLower());
    position.upperTick = BigInt.fromI32(result.value.getTickUpper());
    // updated in increase liquidity handler
    position.liquidity = BI_0;
    position.direct = false;
    position.pool = Bytes.fromHexString(poolAddress.toHex());
    position.save();

    return position;
}

function getNftPosition(tokenId: BigInt): Position | null {
    let id = getNftPositionId(tokenId);
    return Position.load(id);
}

export function handleIncreaseLiquidity(event: IncreaseLiquidityEvent): void {
    let pool = getPoolOrThrow(event.address);
    pool.token0Tvl = pool.token0Tvl.plus(event.params.amount0);
    pool.token1Tvl = pool.token1Tvl.plus(event.params.amount1);
    pool.save();

    let position = getOrCreateNftPosition(event.params.tokenId);
    if (position == null) return;
    position.liquidity = position.liquidity.plus(event.params.actualLiquidity);
    position.save();

    if (!event.params.actualLiquidity.isZero()) {
        let nonZeroLiquidityChange = createBaseEvent(event, position.pool);
        nonZeroLiquidityChange.liquidityDelta = event.params.actualLiquidity;
        nonZeroLiquidityChange.position = position.id;
        nonZeroLiquidityChange.save();
    }
}

export function handleDecreaseLiquidity(event: DecreaseLiquidityEvent): void {
    let pool = getPoolOrThrow(event.address);
    pool.token0Tvl = pool.token0Tvl.minus(event.params.amount0);
    pool.token1Tvl = pool.token1Tvl.minus(event.params.amount1);
    pool.save();

    let position = getNftPosition(event.params.tokenId);
    if (position == null) return;
    position.liquidity = position.liquidity.minus(event.params.liquidity);
    position.save();

    if (!event.params.liquidity.isZero()) {
        let nonZeroLiquidityChange = createBaseEvent(event, position.pool);
        nonZeroLiquidityChange.liquidityDelta = event.params.liquidity.neg();
        nonZeroLiquidityChange.position = position.id;
        nonZeroLiquidityChange.save();
    }
}

export function handleTransfer(event: TransferEvent): void {
    // We don't register the position at NFT mint time because at this point
    // it has 0 liquidity. When creating a new position the IncreaseLiquidity
    // event is always emitted, so we register the position there if non-zero
    // liquidity is added
    if (event.params.from == Address.zero()) return;

    let position = getNftPosition(event.params.tokenId);
    if (position == null) return;

    position.owner = event.params.to;
    position.save();
}
