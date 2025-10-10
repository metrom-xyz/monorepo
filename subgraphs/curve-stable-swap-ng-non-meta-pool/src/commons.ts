import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import { Pool, Position, Token } from "../generated/schema";
import { Erc20 } from "../generated/Pool/Erc20";
import { Erc20BytesSymbol } from "../generated/Pool/Erc20BytesSymbol";
import { Erc20BytesName } from "../generated/Pool/Erc20BytesName";
import { Pool as PoolContract } from "../generated/Pool/Pool";
import {
    NATIVE_TOKEN_ADDRESS,
    NATIVE_TOKEN_DECIMALS,
    NATIVE_TOKEN_NAME,
    NATIVE_TOKEN_SYMBOL,
    POOL_ADDRESS,
} from "./constants";

export const ADDRESS_ZERO = Address.zero();
export const BI_0 = BigInt.zero();
export const BI_1 = BigInt.fromI32(1);

export function getEventId(event: ethereum.Event): Bytes {
    return changetype<Bytes>(event.block.number);
}

export function getOrCreatePool(address: Address): Pool {
    let pool = Pool.load(address);
    if (pool !== null) return pool;

    pool = new Pool(address);

    const poolContract = PoolContract.bind(address);

    let tokens: Bytes[] = [];
    let i = BI_0;
    while (true) {
        let token = poolContract.try_coins(i);
        if (token.reverted || token.value == ADDRESS_ZERO) break;

        tokens.push(getOrCreateToken(token.value).id);

        i = i.plus(BI_1);
    }
    if (tokens.length === 0)
        throw new Error(
            `Could not fetch tokens for pool with address ${address.toHex()}`,
        );
    pool.tokens = tokens;

    let tvls: BigInt[] = [];
    for (let i = 0; i < pool.tokens.length; i++) tvls.push(BI_0);
    pool.tvls = tvls;

    pool.liquidity = BI_0;
    pool.save();

    return pool;
}

export function getPoolOrThrow(id: Bytes): Pool {
    let pool = Pool.load(id);
    if (pool !== null) return pool;

    throw new Error(`Could not find pool ${id.toHex()}`);
}

export function getPositionId(owner: Address): Bytes {
    return changetype<Address>(owner);
}

export function getOrCreatePosition(owner: Address): Position {
    let id = getPositionId(owner);
    let position = Position.load(id);
    if (position !== null) return position;

    position = new Position(id);
    position.owner = owner;
    position.liquidity = BI_0;
    position.pool = POOL_ADDRESS;
    position.save();

    return position;
}

export function getPositionOrThrow(owner: Address): Position {
    let id = getPositionId(owner);
    let position = Position.load(id);
    if (position !== null) return position;

    throw new Error(
        `Could not find position on pool ${POOL_ADDRESS.toHex()} for owner ${owner.toHex()}`,
    );
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

export function getOrCreateToken(address: Address): Token {
    let token = Token.load(address);
    if (token !== null) return token;

    if (address == NATIVE_TOKEN_ADDRESS) {
        token = new Token(NATIVE_TOKEN_ADDRESS);
        token.symbol = NATIVE_TOKEN_SYMBOL;
        token.name = NATIVE_TOKEN_NAME;
        token.decimals = NATIVE_TOKEN_DECIMALS;
        token.save();
        return token;
    }

    let symbol = fetchTokenSymbol(address);
    if (symbol === null)
        throw new Error(
            `Could not resolve symbol for ERC20 token at address ${address.toHex()}`,
        );

    let name = fetchTokenName(address);
    if (name === null)
        throw new Error(
            `Could not resolve name for ERC20 token at address ${address.toHex()}`,
        );

    let decimals = fetchTokenDecimals(address);
    if (decimals === null)
        throw new Error(
            `Could not resolve decimals for ERC20 token at address ${address.toHex()}`,
        );

    token = new Token(address);
    token.symbol = symbol;
    token.name = name;
    token.decimals = decimals;
    token.save();

    return token;
}
