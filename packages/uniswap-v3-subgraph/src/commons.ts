import {
    Address,
    BigDecimal,
    BigInt,
    Bytes,
    ethereum,
} from "@graphprotocol/graph-ts";
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

export const BI_MINUS_1 = BigInt.fromI32(-1);
export const BI_0 = BigInt.zero();
export const BI_1 = BigInt.fromI32(1);
export const BD_0 = BigDecimal.zero();
export const BD_10 = BigDecimal.fromString("10");
const BD_Q192 = BigDecimal.fromString(Math.pow(2, 192).toString());

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

export function getTokenOrThrow(address: Address): Token {
    let token = Token.load(address);
    if (token != null) return token;

    throw new Error(`Could not find token with address ${address.toHex()}`);
}

export function fetchTokenSymbol(address: Address): string | null {
    let contract = Erc20.bind(address);
    let result = contract.try_symbol();
    if (!result.reverted) return result.value;

    let bytesContract = Erc20BytesSymbol.bind(address);
    let bytesResult = bytesContract.try_symbol();
    if (!bytesResult.reverted) return bytesResult.value.toString();

    return null;
}

export function fetchTokenName(address: Address): string | null {
    let contract = Erc20.bind(address);
    let result = contract.try_name();
    if (!result.reverted) return result.value;

    let bytesContract = Erc20BytesName.bind(address);
    let bytesResult = bytesContract.try_name();
    if (!bytesResult.reverted) return bytesResult.value.toString();

    return null;
}

export function fetchTokenDecimals(address: Address): BigInt | null {
    let contract = Erc20.bind(address);
    let result = contract.try_decimals();
    return result.reverted ? null : result.value;
}

export function getOrCreateToken(address: Address): Token | null {
    let token = Token.load(address);
    if (token !== null) return token;

    let symbol = fetchTokenSymbol(address);
    if (symbol === null) return null;

    let name = fetchTokenName(address);
    if (name === null) return null;

    let decimals = fetchTokenDecimals(address);
    if (decimals === null) return null;

    token = new Token(address);
    token.symbol = symbol;
    token.name = name;
    token.decimals = decimals;
    token.save();

    return token;
}

export function sqrtPriceToTokenPrices(
    sqrtPrice: BigInt,
    token0Decimals: BigInt,
    token1Decimals: BigInt,
): BigDecimal[] {
    let price = sqrtPrice.pow(2).toBigDecimal();
    let price1 = price
        .div(BD_Q192)
        .times(exponentToBigDecimal(token0Decimals))
        .div(exponentToBigDecimal(token1Decimals));

    let price0 = safeDiv(BigDecimal.fromString("1"), price1);
    return [price0, price1];
}

function exponentToBigDecimal(decimals: BigInt): BigDecimal {
    let bd = BigDecimal.fromString("1");
    for (let i = BI_0; i.lt(decimals as BigInt); i = i.plus(BI_1)) {
        bd = bd.times(BD_10);
    }
    return bd;
}

function safeDiv(amount0: BigDecimal, amount1: BigDecimal): BigDecimal {
    if (amount1.equals(BD_0)) {
        return BD_0;
    } else {
        return amount0.div(amount1);
    }
}
