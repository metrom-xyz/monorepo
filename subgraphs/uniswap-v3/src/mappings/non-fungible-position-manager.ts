import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
    IncreaseLiquidity as IncreaseLiquidityEvent,
    DecreaseLiquidity as DecreaseLiquidityEvent,
    Transfer as TransferEvent,
} from "../../generated/NonFungiblePositionManager/NonFungiblePositionManager";
import {
    LiquidityChange,
    LiquidityTransfer,
    Position,
} from "../../generated/schema";
import {
    BI_0,
    FactoryContract,
    getEventId,
    NonFungiblePositionManagerContract,
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

    let poolAddress = FactoryContract.getPool(
        result.value.getToken0(),
        result.value.getToken1(),
        result.value.getFee(),
    );

    position = new Position(id);
    position.owner = NonFungiblePositionManagerContract.ownerOf(tokenId);
    position.lowerTick = BigInt.fromI32(result.value.getTickLower());
    position.upperTick = BigInt.fromI32(result.value.getTickUpper());
    position.liquidity = BI_0; // updated in increase liquidity handler
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
    let position = getOrCreateNftPosition(event.params.tokenId);
    if (position == null) return;

    if (!event.params.liquidity.isZero()) {
        position.liquidity = position.liquidity.plus(event.params.liquidity);
        position.save();

        let liquidityChange = new LiquidityChange(getEventId(event));
        liquidityChange.timestamp = event.block.timestamp;
        liquidityChange.blockNumber = event.block.number;
        liquidityChange.transactionHash = event.transaction.hash;
        liquidityChange.delta = event.params.liquidity;
        liquidityChange.position = position.id;
        liquidityChange.save();
    }
}

export function handleDecreaseLiquidity(event: DecreaseLiquidityEvent): void {
    let position = getNftPosition(event.params.tokenId);
    if (position == null) return;

    if (!event.params.liquidity.isZero()) {
        position.liquidity = position.liquidity.minus(event.params.liquidity);
        position.save();

        let liquidityChange = new LiquidityChange(getEventId(event));
        liquidityChange.timestamp = event.block.timestamp;
        liquidityChange.blockNumber = event.block.number;
        liquidityChange.transactionHash = event.transaction.hash;
        liquidityChange.delta = event.params.liquidity.neg();
        liquidityChange.position = position.id;
        liquidityChange.save();
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

    let liquidityTransfer = new LiquidityTransfer(getEventId(event));
    liquidityTransfer.timestamp = event.block.timestamp;
    liquidityTransfer.blockNumber = event.block.number;
    liquidityTransfer.transactionHash = event.transaction.hash;
    liquidityTransfer.from = event.params.from;
    liquidityTransfer.to = event.params.to;
    liquidityTransfer.position = position.id;
    liquidityTransfer.save();
}
