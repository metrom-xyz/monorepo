import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import { Block, Event, Pool, Token } from "../generated/schema";
import { NonFungiblePositionManager } from "../generated/NonFungiblePositionManager/NonFungiblePositionManager";
import { Factory } from "../generated/Factory/Factory";
import {
    FACTORY_ADDRESS,
    NON_FUNGIBLE_POSITION_MANAGER_ADDRESS,
} from "./addresses";
import { Erc20 } from "../generated/Factory/Erc20";
import { Erc20BytesSymbol } from "../generated/Factory/Erc20BytesSymbol";
import { Erc20BytesName } from "../generated/Factory/Erc20BytesName";

export const NonFungiblePositionManagerContract =
    NonFungiblePositionManager.bind(NON_FUNGIBLE_POSITION_MANAGER_ADDRESS);
export const FactoryContract = Factory.bind(FACTORY_ADDRESS);

export function getOrCreateBlock(event: ethereum.Event): Block {
    let block = Block.load(event.block.hash);
    if (block !== null) return block;

    block = new Block(event.block.hash);
    block.number = event.block.number;
    block.timestamp = event.block.timestamp;
    block.save();

    return block;
}

export function createBaseEvent(event: ethereum.Event, poolId: Bytes): Event {
    let id = changetype<Bytes>(
        event.block.number.leftShift(40).plus(event.logIndex).reverse(),
    );
    let baseEvent = new Event(id);
    baseEvent.transactionHash = event.transaction.hash;
    baseEvent.block = getOrCreateBlock(event).id;
    baseEvent.logIndex = event.logIndex;
    baseEvent.pool = poolId;
    baseEvent.save();
    return baseEvent;
}

export function getPoolOrThrow(address: Address): Pool {
    let pool = Pool.load(address);
    if (pool != null) return pool;

    throw new Error(`Could not find pool with address ${address.toHex()}`);
}

export function fetchTokenSymbol(address: Address): string {
    let contract = Erc20.bind(address);
    let result = contract.try_symbol();
    if (!result.reverted) return result.value;

    let bytesContract = Erc20BytesSymbol.bind(address);
    let bytesResult = bytesContract.try_symbol();
    if (!bytesResult.reverted) return bytesResult.value.toString();

    return "unknown";
}

export function fetchTokenName(address: Address): string {
    let contract = Erc20.bind(address);
    let result = contract.try_name();
    if (!result.reverted) return result.value;

    let bytesContract = Erc20BytesName.bind(address);
    let bytesResult = bytesContract.try_name();
    if (!bytesResult.reverted) return bytesResult.value.toString();

    return "unknown";
}

export function fetchTokenDecimals(address: Address): BigInt {
    let decimals = -1;

    let contract = Erc20.bind(address);
    let result = contract.try_decimals();
    if (!result.reverted) decimals = result.value;

    return BigInt.fromI32(decimals);
}

export function getOrCreateToken(address: Address): Token {
    let token = Token.load(address);
    if (token !== null) return token;

    token = new Token(address);
    token.symbol = fetchTokenSymbol(address);
    token.name = fetchTokenName(address);
    token.decimals = fetchTokenDecimals(address);
    token.save();

    return token;
}
