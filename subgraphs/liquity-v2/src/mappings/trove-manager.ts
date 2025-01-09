import { Address, dataSource } from "@graphprotocol/graph-ts";
import {
    CollateralChangeEvent,
    DebtChangeEvent,
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
        Address.fromBytes(dataSource.context().getBytes("address:troveNft")),
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
    let previousDebt = trove.debt;
    let previousDeposit = trove.deposit;

    let troveData = troveManagerContract.getLatestTroveData(
        event.params._troveId,
    );
    let newDebt = troveData.entireDebt;
    let newDeposit = troveData.entireColl;
    let newInterestRate = troveData.annualInterestRate;

    let collateralDelta = newDeposit.minus(previousDeposit);
    if (!collateralDelta.isZero()) {
        let collateralChangeEvent = new CollateralChangeEvent(
            getEventId(event),
        );
        collateralChangeEvent.timestamp = event.block.timestamp;
        collateralChangeEvent.blockNumber = event.block.number;
        collateralChangeEvent.collateral = trove.collateral;
        collateralChangeEvent.trove = trove.id;
        collateralChangeEvent.delta = collateralDelta;
        collateralChangeEvent.save();
    }

    let debtDelta = newDebt.minus(previousDebt);
    if (!debtDelta.isZero()) {
        let debtChangeEvent = new DebtChangeEvent(getEventId(event));
        debtChangeEvent.timestamp = event.block.timestamp;
        debtChangeEvent.blockNumber = event.block.number;
        debtChangeEvent.trove = trove.id;
        debtChangeEvent.delta = debtDelta;
        debtChangeEvent.save();
    }

    let collateral = getCollateralOrThrow(trove.collateral);
    collateral.deposited = collateral.deposited
        .minus(previousDeposit)
        .plus(newDeposit);
    collateral.debt = collateral.debt.minus(previousDebt).plus(newDebt);
    collateral.save();

    trove.debt = newDebt;
    trove.deposit = newDeposit;
    trove.interestRate = newInterestRate;
    trove.save();
}
