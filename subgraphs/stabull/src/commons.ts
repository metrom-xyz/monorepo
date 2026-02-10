import {
    Address,
    BigDecimal,
    BigInt,
    Bytes,
    ethereum,
} from "@graphprotocol/graph-ts";
import { Pool, Position, Token } from "../generated/schema";
import { Erc20 } from "../generated/CurveFactoryV2/Erc20";
import { Erc20BytesSymbol } from "../generated/CurveFactoryV2/Erc20BytesSymbol";
import { Erc20BytesName } from "../generated/CurveFactoryV2/Erc20BytesName";
import { Curve as CurveContract } from "../generated/templates/Curve/Curve";

export const BI_0 = BigInt.zero();
export const BI_1 = BigInt.fromI32(1);
export const BI_2 = BigInt.fromI32(2);
export const BD_0 = BigDecimal.zero();
export const ZERO_ADDRESS = Address.zero();

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

export function fetchTokenDecimals(address: Address): i32 {
    let contract = Erc20.bind(address);
    let result = contract.try_decimals();
    return result.reverted ? -1 : result.value.toI32();
}

export function getOrCreateToken(address: Address): Token | null {
    let token = Token.load(address);
    if (token !== null) return token;

    let symbol = fetchTokenSymbol(address);
    if (symbol === null) return null;

    let name = fetchTokenName(address);
    if (name === null) return null;

    let decimals = fetchTokenDecimals(address);
    if (decimals === -1) return null;

    token = new Token(address);
    token.symbol = symbol;
    token.name = name;
    token.decimals = decimals;
    token.save();

    return token;
}

function getPositionId(pool: Address, owner: Address): Bytes {
    return pool.concat(owner);
}

export function getOrCreatePosition(pool: Address, owner: Address): Position {
    const id = getPositionId(pool, owner);
    let position = Position.load(id);

    if (position === null) {
        position = new Position(id);
        position.owner = owner;
        position.liquidity = BI_0;
        position.pool = pool;
        position.save();
    }

    return position;
}

export function getPositionOrThrow(pool: Address, owner: Address): Position {
    let position = Position.load(getPositionId(pool, owner));

    if (position === null)
        throw new Error(
            `Could not find position by owner ${owner.toHex()} on pool ${pool.toHex()}`,
        );

    return position;
}

function scale18DecimalsBigInt(value: BigInt, targetDecimals: i32): BigInt {
    const difference = 18 - targetDecimals;
    if (difference == 0) return value;

    const factor = BigInt.fromI32(10).pow(
        <u8>(difference < 0 ? -difference : difference),
    );
    return difference > 0 ? value.div(factor) : value.times(factor);
}

export function updatePoolTvlAndSave(pool: Pool, block: ethereum.Block): void {
    if (pool._tvlsUpdatedAtBlock === block.number) return;

    const contract = CurveContract.bind(changetype<Address>(pool.id));
    const rawTvls = contract.liquidity().getIndividual_();

    pool.token0Tvl = scale18DecimalsBigInt(
        rawTvls[0],
        getTokenOrThrow(changetype<Address>(pool.token0)).decimals,
    );
    pool.token1Tvl = scale18DecimalsBigInt(
        rawTvls[1],
        getTokenOrThrow(changetype<Address>(pool.token1)).decimals,
    );
    pool._tvlsUpdatedAtBlock = block.number;
    pool.save();
}
