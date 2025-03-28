import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
    IncreaseLiquidity as IncreaseLiquidityEvent,
    DecreaseLiquidity as DecreaseLiquidityEvent,
    Transfer as TransferEvent,
} from "../../../generated/NonFungiblePositionManager/NonFungiblePositionManager";
import {
    ConcentratedLiquidityChange,
    ConcentratedLiquidityTransfer,
    ConcentratedPosition,
    Gauge,
} from "../../../generated/schema";
import {
    BI_0,
    ClFactoryContract,
    getEventId,
    NonFungiblePositionManagerContract,
} from "../../commons";
import { ALM_CORE_ADDRESS } from "../../addresses";

function getPositionId(tokenId: BigInt): Bytes {
    return Bytes.fromByteArray(Bytes.fromBigInt(tokenId));
}

function getOrCreatePosition(tokenId: BigInt): ConcentratedPosition | null {
    let id = getPositionId(tokenId);
    let position = ConcentratedPosition.load(id);
    if (position != null) return position;

    let result = NonFungiblePositionManagerContract.try_positions(tokenId);

    // the following call reverts in situations where the position is minted
    // and deleted in the same block
    if (result.reverted) return null;

    let poolAddress = ClFactoryContract.getPool(
        result.value.getToken0(),
        result.value.getToken1(),
        result.value.getTickSpacing(),
    );

    position = new ConcentratedPosition(id);
    position.owner = NonFungiblePositionManagerContract.ownerOf(tokenId);
    position.lowerTick = result.value.getTickLower();
    position.upperTick = result.value.getTickUpper();
    position.liquidity = BI_0; // updated in increase liquidity handler
    position.pool = Bytes.fromHexString(poolAddress.toHex());
    position.save();

    return position;
}

function getPosition(tokenId: BigInt): ConcentratedPosition | null {
    return ConcentratedPosition.load(getPositionId(tokenId));
}

export function handleIncreaseLiquidity(event: IncreaseLiquidityEvent): void {
    let position = getOrCreatePosition(event.params.tokenId);
    if (position == null) return;

    if (!event.params.liquidity.isZero()) {
        position.liquidity = position.liquidity.plus(event.params.liquidity);
        position.save();

        let liquidityChange = new ConcentratedLiquidityChange(
            getEventId(event),
        );
        liquidityChange.timestamp = event.block.timestamp;
        liquidityChange.blockNumber = event.block.number;
        liquidityChange.delta = event.params.liquidity;
        liquidityChange.pool = position.pool;
        liquidityChange.position = position.id;
        liquidityChange.save();
    }
}

export function handleDecreaseLiquidity(event: DecreaseLiquidityEvent): void {
    let position = getPosition(event.params.tokenId);
    if (position == null) return;

    if (!event.params.liquidity.isZero()) {
        position.liquidity = position.liquidity.minus(event.params.liquidity);
        position.save();

        let liquidityChange = new ConcentratedLiquidityChange(
            getEventId(event),
        );
        liquidityChange.timestamp = event.block.timestamp;
        liquidityChange.blockNumber = event.block.number;
        liquidityChange.delta = event.params.liquidity.neg();
        liquidityChange.pool = position.pool;
        liquidityChange.position = position.id;
        liquidityChange.save();
    }
}

export function handleTransfer(event: TransferEvent): void {
    // We don't register the position at NFT mint time because at this point
    // it has 0 liquidity. When creating a new position the IncreaseLiquidity
    // event is always emitted, so we register the position there if non-zero
    // liquidity is added
    if (
        event.params.from == Address.zero() ||
        event.params.to == Address.zero() ||
        Gauge.load(event.params.from) !== null ||
        Gauge.load(event.params.to) !== null ||
        event.params.to === ALM_CORE_ADDRESS
    )
        return;

    let position = getPosition(event.params.tokenId);
    if (position == null) return;

    position.owner = event.params.to;
    position.save();

    let liquidityTransfer = new ConcentratedLiquidityTransfer(
        getEventId(event),
    );
    liquidityTransfer.timestamp = event.block.timestamp;
    liquidityTransfer.blockNumber = event.block.number;
    liquidityTransfer.from = position.owner;
    liquidityTransfer.to = event.params.to;
    liquidityTransfer.pool = position.pool;
    liquidityTransfer.position = position.id;
    liquidityTransfer.save();
}
