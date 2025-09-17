import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
    AddLiquidity as AddLiquidityEvent,
    DecLiquidity as DecLiquidityEvent,
    Transfer as TransferEvent,
} from "../../generated/LiquidityManager/LiquidityManager";
import {
    LiquidityChange,
    LiquidityTransfer,
    Position,
} from "../../generated/schema";
import { BI_0, getEventId, LiquidityManagerContract } from "../commons";
import { TRACK_STATE_STARTING_FROM_BLOCK } from "../addresses";

function getNftPositionId(tokenId: BigInt): Bytes {
    return Bytes.fromByteArray(Bytes.fromBigInt(tokenId));
}

function getOrCreateNftPosition(tokenId: BigInt): Position | null {
    let id = getNftPositionId(tokenId);
    let position = Position.load(id);
    if (position != null) return position;

    let result = LiquidityManagerContract.try_liquidities(tokenId);

    // the following call reverts in situations where the position is minted
    // and deleted in the same block - from my investigation this happens
    // in calls from  BancorSwap
    // (e.g. 0xf7867fa19aa65298fadb8d4f72d0daed5e836f3ba01f0b9b9631cdc6c36bed40)
    if (result.reverted) return null;

    const poolMeta = LiquidityManagerContract.poolMetas(
        result.value.getPoolId(),
    );
    const poolAddress = LiquidityManagerContract.pool(
        poolMeta.getTokenX(),
        poolMeta.getTokenY(),
        poolMeta.getFee(),
    );

    position = new Position(id);
    position.owner = LiquidityManagerContract.ownerOf(tokenId);
    position.lowerTick = result.value.getLeftPt();
    position.upperTick = result.value.getRightPt();
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

export function handleIncreaseLiquidity(event: AddLiquidityEvent): void {
    let position = getOrCreateNftPosition(event.params.nftId);
    if (position == null) return;

    if (!event.params.liquidityDelta.isZero()) {
        position.liquidity = position.liquidity.plus(
            event.params.liquidityDelta,
        );
        position.save();

        if (event.block.number < TRACK_STATE_STARTING_FROM_BLOCK) return;

        let liquidityChange = new LiquidityChange(
            getEventId(event.block.number, event.logIndex),
        );
        liquidityChange.timestamp = event.block.timestamp;
        liquidityChange.blockNumber = event.block.number;
        liquidityChange.delta = event.params.liquidityDelta;
        liquidityChange.position = position.id;
        liquidityChange.save();
    }
}

export function handleDecreaseLiquidity(event: DecLiquidityEvent): void {
    let position = getNftPosition(event.params.nftId);
    if (position == null) return;

    if (!event.params.liquidityDelta.isZero()) {
        position.liquidity = position.liquidity.minus(
            event.params.liquidityDelta,
        );
        position.save();

        if (event.block.number < TRACK_STATE_STARTING_FROM_BLOCK) return;

        let liquidityChange = new LiquidityChange(
            getEventId(event.block.number, event.logIndex),
        );
        liquidityChange.timestamp = event.block.timestamp;
        liquidityChange.blockNumber = event.block.number;
        liquidityChange.delta = event.params.liquidityDelta.neg();
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

    if (event.block.number < TRACK_STATE_STARTING_FROM_BLOCK) return;

    let liquidityTransfer = new LiquidityTransfer(
        getEventId(event.block.number, event.logIndex),
    );
    liquidityTransfer.timestamp = event.block.timestamp;
    liquidityTransfer.blockNumber = event.block.number;
    liquidityTransfer.from = event.params.from;
    liquidityTransfer.to = event.params.to;
    liquidityTransfer.position = position.id;
    liquidityTransfer.save();
}
