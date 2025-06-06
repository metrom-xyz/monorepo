import { Address, dataSource } from "@graphprotocol/graph-ts";
import {
    CollateralChange,
    MintedDebtChange,
    Trove,
} from "../../generated/schema";
import {
    TroveManager as TroveManagerContract,
    TroveOperation as TroveOperationEvent,
} from "../../generated/templates/TroveManager/TroveManager";
import { getCollateralOrThrow, getEventId, getOrCreateTrove } from "../commons";

// see Operation enum in
// contracts/src/Interfaces/ITroveEvents.sol
let OP_OPEN_TROVE = 0;
let OP_CLOSE_TROVE = 1;
let OP_ADJUST_TROVE = 2;
let OP_ADJUST_TROVE_INTEREST_RATE = 3;
let OP_APPLY_PENDING_DEBT = 4;
let OP_LIQUIDATE = 5;
let OP_REDEEM_COLLATERAL = 6;
let OP_OPEN_TROVE_AND_JOIN_BATCH = 7;
let OP_SET_INTEREST_BATCH_MANAGER = 8;
let OP_REMOVE_FROM_BATCH = 9;

export function handleTroveOperation(event: TroveOperationEvent): void {
    let operation = event.params._operation;
    let troveManagerContract = TroveManagerContract.bind(event.address);
    let trove = getOrCreateTrove(
        dataSource.context().getBytes("collateralId"),
        event.params._troveId,
        Address.fromBytes(dataSource.context().getBytes("troveNftAddress")),
    );

    switch (operation) {
        case OP_OPEN_TROVE:
        case OP_ADJUST_TROVE:
        case OP_ADJUST_TROVE_INTEREST_RATE:
        case OP_APPLY_PENDING_DEBT:
        case OP_OPEN_TROVE_AND_JOIN_BATCH:
        case OP_REDEEM_COLLATERAL:
        case OP_CLOSE_TROVE:
        case OP_LIQUIDATE:
            updateTrove(trove, event, troveManagerContract);
            break;
        case OP_SET_INTEREST_BATCH_MANAGER:
        case OP_REMOVE_FROM_BATCH:
            // do nothing
            break;
        default:
            throw new Error("Unsupported operation: " + operation.toString());
    }
}

function updateTrove(
    trove: Trove,
    event: TroveOperationEvent,
    troveManagerContract: TroveManagerContract,
): void {
    let previousTvl = trove.tvl;
    let previousMintedDebt = trove.mintedDebt;

    let troveData = troveManagerContract.getLatestTroveData(
        event.params._troveId,
    );
    let newMintedDebt = troveData.entireDebt;
    let newTvl = troveData.entireColl;

    let tvlDelta = newTvl.minus(previousTvl);
    if (!tvlDelta.isZero()) {
        let collateralChange = new CollateralChange(getEventId(event));
        collateralChange.timestamp = event.block.timestamp;
        collateralChange.blockNumber = event.block.number;
        collateralChange.collateral = trove.collateral;
        collateralChange.troveId = trove.id;
        collateralChange.owner = trove.owner;
        collateralChange.delta = tvlDelta;
        collateralChange.save();
    }

    let mintedDebtDelta = newMintedDebt.minus(previousMintedDebt);
    if (!mintedDebtDelta.isZero()) {
        let mintedDebtChange = new MintedDebtChange(getEventId(event));
        mintedDebtChange.timestamp = event.block.timestamp;
        mintedDebtChange.blockNumber = event.block.number;
        mintedDebtChange.troveId = trove.id;
        mintedDebtChange.owner = trove.owner;
        mintedDebtChange.collateral = trove.collateral;
        mintedDebtChange.delta = mintedDebtDelta;
        mintedDebtChange.save();
    }

    let collateral = getCollateralOrThrow(trove.collateral);
    collateral.tvl = collateral.tvl.minus(previousTvl).plus(newTvl);
    collateral.mintedDebt = collateral.mintedDebt
        .minus(previousMintedDebt)
        .plus(newMintedDebt);
    collateral.save();

    trove.tvl = newTvl;
    trove.mintedDebt = newMintedDebt;
    trove.save();
}
