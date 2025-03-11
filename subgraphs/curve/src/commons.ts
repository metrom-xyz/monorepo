import {
    Address,
    BigInt,
    ByteArray,
    Bytes,
    crypto,
    ethereum,
} from "@graphprotocol/graph-ts";
import { Pool, Position, Token, LpToken } from "../generated/schema";
import { Erc20 } from "../generated/MainRegistry/Erc20";
import { Erc20BytesSymbol } from "../generated/MainRegistry/Erc20BytesSymbol";
import { Erc20BytesName } from "../generated/MainRegistry/Erc20BytesName";
import { Pool as PoolTemplate } from "../generated/templates";
import {
    MAIN_REGISTRY_ADDRESS,
    NATIVE_TOKEN_ADDRESS,
    NATIVE_TOKEN_DECIMALS,
    NATIVE_TOKEN_NAME,
    NATIVE_TOKEN_SYMBOL,
} from "./constants";
import { MainRegistry } from "../generated/MainRegistry/MainRegistry";

export const ADDRESS_ZERO = Address.zero();
export const BI_0 = BigInt.zero();
export const BI_1 = BigInt.fromI32(1);

export const ERC20_TRANSFER_EVENT_SIGNATURE = crypto.keccak256(
    ByteArray.fromUTF8("Transfer(address,address,uint256)"),
);

export const MainRegistryContract = MainRegistry.bind(MAIN_REGISTRY_ADDRESS);

export function getEventId(event: ethereum.Event): Bytes {
    return changetype<Bytes>(
        event.block.number.leftShift(40).plus(event.logIndex).reverse(),
    );
}

export function getOrCreatePool(blockNumber: BigInt, address: Address): Pool {
    let pool = Pool.load(address);
    if (pool !== null) return pool;

    pool = new Pool(address);
    pool._tvlsUpdatedAtBlockNumber = BI_0;

    let tokens: Bytes[] = [];
    let coins = MainRegistryContract.get_coins(address);
    for (let i = 0; i < coins.length; i++) {
        if (coins[i] == ADDRESS_ZERO) break;
        tokens.push(getOrCreateToken(coins[i]).id);
    }
    pool.tokens = tokens;

    if (MainRegistryContract.is_meta(address)) {
        let basePoolAddress = MainRegistryContract.get_pool_from_lp_token(
            changetype<Address>(tokens[1]),
        );
        pool.base = getOrCreatePool(blockNumber, basePoolAddress).id;
    }

    updateTokenTvls(blockNumber, pool);
    pool.liquidity = BI_0;
    pool.save();

    PoolTemplate.create(address);

    let lpTokenAddress = MainRegistryContract.get_lp_token(address);
    let lpToken = new LpToken(lpTokenAddress);
    lpToken.pool = pool.id;
    lpToken.save();

    return pool;
}

export function getPoolOrThrow(id: Bytes): Pool {
    let pool = Pool.load(id);
    if (pool !== null) return pool;

    throw new Error(`Could not find pool ${id.toHex()}`);
}

export function updateTokenTvls(blockNumber: BigInt, pool: Pool): void {
    if (pool._tvlsUpdatedAtBlockNumber < blockNumber) {
        let onChainTvls = MainRegistryContract.get_balances(
            changetype<Address>(pool.id),
        );

        let tvls: BigInt[] = [];
        for (let i = 0; i < tvls.length; i++) {
            if (onChainTvls[i].isZero()) break;
            tvls.push(onChainTvls[i]);
        }

        pool.tvls = tvls;
        pool._tvlsUpdatedAtBlockNumber = blockNumber;
    }
}

export function getOrCreatePosition(
    poolAddress: Address,
    owner: Address,
): Position {
    let id = poolAddress.concat(owner);
    let position = Position.load(id);
    if (position !== null) return position;

    position = new Position(id);
    position.owner = owner;
    position.liquidity = BI_0;
    position.pool = poolAddress;
    position.save();

    return position;
}

export function getPositionOrThrow(
    poolAddress: Address,
    owner: Address,
): Position {
    let id = poolAddress.concat(owner);
    let position = Position.load(id);
    if (position !== null) return position;

    throw new Error(
        `Could not find position on pool ${poolAddress.toHex()} for owner ${owner.toHex()}`,
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
