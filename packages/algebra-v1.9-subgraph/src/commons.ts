import { Address, Bytes, ethereum } from "@graphprotocol/graph-ts";
import { Event, Pool } from "../generated/schema";
import { NonFungiblePositionManager } from "../generated/NonFungiblePositionManager/NonFungiblePositionManager";
import { Factory } from "../generated/Factory/Factory";
import {
    FACTORY_ADDRESS,
    NON_FUNGIBLE_POSITION_MANAGER_ADDRESS,
} from "./addresses";

export const NonFungiblePositionManagerContract =
    NonFungiblePositionManager.bind(NON_FUNGIBLE_POSITION_MANAGER_ADDRESS);
export const FactoryContract = Factory.bind(FACTORY_ADDRESS);

export function createBaseEvent(event: ethereum.Event, poolId: Bytes): Event {
    let id = changetype<Bytes>(
        event.block.number.leftShift(40).plus(event.logIndex).reverse(),
    );
    let baseEvent = new Event(id);
    baseEvent.transactionHash = event.transaction.hash;
    baseEvent.blockNumber = event.block.number;
    baseEvent.pool = poolId;
    baseEvent.save();
    return baseEvent;
}

export function getPoolOrThrow(address: Address): Pool {
    let pool = Pool.load(address);
    if (pool != null) return pool;

    throw new Error(`Could not find pool with address ${address.toHex()}`);
}
