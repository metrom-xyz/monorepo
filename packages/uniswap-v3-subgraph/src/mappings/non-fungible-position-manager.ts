import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
    IncreaseLiquidity as IncreaseLiquidityEvent,
    DecreaseLiquidity as DecreaseLiquidityEvent,
    Transfer as TransferEvent,
} from "../../generated/NonFungiblePositionManager/NonFungiblePositionManager";
import { Position } from "../../generated/schema";
import {
    FactoryContract,
    NonFungiblePositionManagerContract,
    createBaseEvent,
} from "../commons";

function getNftPositionId(tokenId: BigInt): Bytes {
    return Bytes.fromByteArray(Bytes.fromBigInt(tokenId));
}

function getOrCreateNftPosition(tokenId: BigInt): Position {
    let id = getNftPositionId(tokenId);
    let position = Position.load(id);
    if (position != null) return position;

    let result = NonFungiblePositionManagerContract.try_positions(tokenId);

    if (result.reverted)
        throw new Error(
            `Could not get position with id ${tokenId.toString()} from NonFungiblePositionManagerContract`,
        );

    // the following call reverts in situations where the position is minted
    // and deleted in the same block - from my investigation this happens
    // in calls from  BancorSwap
    // (e.g. 0xf7867fa19aa65298fadb8d4f72d0daed5e836f3ba01f0b9b9631cdc6c36bed40)
    let poolAddress = FactoryContract.getPool(
        result.value.getToken0(),
        result.value.getToken1(),
        result.value.getFee(),
    );

    position = new Position(id);
    position.owner = NonFungiblePositionManagerContract.ownerOf(tokenId);
    position.lowerTick = BigInt.fromI32(result.value.getTickLower());
    position.upperTick = BigInt.fromI32(result.value.getTickUpper());
    // updated in increase liquidity handler
    position.liquidity = BigInt.zero();
    position.direct = false;
    position.pool = Bytes.fromHexString(poolAddress.toHex());
    position.save();

    return position;
}

function getNftPositionOrThrow(tokenId: BigInt): Position {
    let id = getNftPositionId(tokenId);
    let position = Position.load(id);
    if (position != null) return position;

    throw new Error(
        `Could not get NFT position with token id ${tokenId.toString()}`,
    );
}

export function handleIncreaseLiquidity(event: IncreaseLiquidityEvent): void {
    if (event.params.liquidity.isZero()) return;

    let position = getOrCreateNftPosition(event.params.tokenId);
    position.liquidity = position.liquidity.plus(event.params.liquidity);
    position.save();

    let nonZeroLiquidityChange = createBaseEvent(event, position.pool);
    nonZeroLiquidityChange.liquidityDelta = event.params.liquidity;
    nonZeroLiquidityChange.position = position.id;
    nonZeroLiquidityChange.save();
}

export function handleDecreaseLiquidity(event: DecreaseLiquidityEvent): void {
    if (event.params.liquidity.isZero()) return;

    let position = getNftPositionOrThrow(event.params.tokenId);
    position.liquidity = position.liquidity.minus(event.params.liquidity);
    position.save();

    let nonZeroLiquidityChange = createBaseEvent(event, position.pool);
    nonZeroLiquidityChange.liquidityDelta = event.params.liquidity.neg();
    nonZeroLiquidityChange.position = position.id;
    nonZeroLiquidityChange.save();
}

export function handleTransfer(event: TransferEvent): void {
    // We don't register the position at NFT mint time because at this point
    // it has 0 liquidity. When creating a new position the IncreaseLiquidity
    // event is always emitted, so we register the position there if non-zero
    // liquidity is added
    if (event.params.from == Address.zero()) return;

    let position = getNftPositionOrThrow(event.params.tokenId);
    position.owner = event.params.to;
    position.save();
}
