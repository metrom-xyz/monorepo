import {
    Address,
    BigInt,
    ByteArray,
    Bytes,
    crypto,
    DataSourceContext,
    ethereum,
} from "@graphprotocol/graph-ts";
import { Gauge, Pool, LpToken, Position, Token } from "../generated/schema";
import { Erc20 } from "../generated/PoolRegistry/Erc20";
import { Erc20BytesSymbol } from "../generated/PoolRegistry/Erc20BytesSymbol";
import { Erc20BytesName } from "../generated/PoolRegistry/Erc20BytesName";
import { UnifiedPool } from "../generated/GaugeController/UnifiedPool";
import {
    LEGACY_POOL_LP_TOKEN,
    NATIVE_TOKEN_ADDRESS,
    NATIVE_TOKEN_DECIMALS,
    NATIVE_TOKEN_NAME,
    NATIVE_TOKEN_SYMBOL,
} from "./constants";
import {
    LpToken as LpTokenTemplate,
    UnifiedPool as UnifiedPoolTemplate,
} from "../generated/templates";

export const ADDRESS_ZERO = Address.zero();
export const BI_0 = BigInt.zero();
export const BI_1 = BigInt.fromI32(1);

export const ERC20_TRANSFER_EVENT_SIGNATURE = crypto.keccak256(
    ByteArray.fromUTF8("Transfer(address,address,uint256)"),
);

export function getEventId(event: ethereum.Event): Bytes {
    return changetype<Bytes>(
        event.block.number.leftShift(40).plus(event.logIndex).reverse(),
    );
}

export function getOrCreatePool(
    address: Address,
    lpTokenAddress: Address | null,
    basePoolAddress: Address | null,
): Pool {
    let pool = Pool.load(address);
    if (pool !== null) return pool;

    pool = new Pool(address);

    let poolContract = UnifiedPool.bind(address);

    let tokens: Bytes[] = [];
    let i = BI_0;
    while (true) {
        let token = poolContract.try_coins(i);
        if (token.reverted) token = poolContract.try_coins1(i);
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

    if (basePoolAddress !== null)
        pool.base = getOrCreatePool(
            basePoolAddress,
            changetype<Address>(pool.tokens[1]),
            null,
        ).id;

    pool._tvlsUpdatedAtBlock = BI_0;

    pool.save();

    let legacyPoolLpTokenAddress = LEGACY_POOL_LP_TOKEN.get(address);
    if (legacyPoolLpTokenAddress === null)
        // Avoids double tracking since legacy pools are directly hardcoded in the manifest
        UnifiedPoolTemplate.createWithContext(address, new DataSourceContext());

    let resolvedLpTokenAddress =
        lpTokenAddress === null ? legacyPoolLpTokenAddress : lpTokenAddress;
    if (resolvedLpTokenAddress === null)
        throw new Error(`No LP token for pool with address ${address.toHex()}`);

    if (legacyPoolLpTokenAddress === null) {
        // Avoids double tracking since legacy pool LPs are directly hardcoded in the manifest
        let lpTokenContext = new DataSourceContext();
        lpTokenContext.setBytes("pool-address", address);
        LpTokenTemplate.createWithContext(
            resolvedLpTokenAddress,
            lpTokenContext,
        );
    }

    let lpToken = new LpToken(resolvedLpTokenAddress);
    lpToken.pool = address;
    lpToken.save();

    return pool;
}

export function updateTokenTvls(blockNumber: BigInt, pool: Pool): void {
    if (pool._tvlsUpdatedAtBlock == blockNumber) return;

    let poolAddress = changetype<Address>(pool.id);
    let poolContract = UnifiedPool.bind(poolAddress);

    let tvls: BigInt[] = [];
    for (let i = 0; i < pool.tokens.length; i++) {
        let idx = BigInt.fromI32(i);
        let tvl = poolContract.try_balances(idx);
        if (tvl.reverted) tvl = poolContract.try_balances1(idx);
        if (tvl.reverted)
            throw new Error(
                `Could not fetch token TVL at index ${i} for pool with address ${poolAddress.toHex()}`,
            );
        tvls.push(tvl.value);
    }

    pool.tvls = tvls;
    pool._tvlsUpdatedAtBlock = blockNumber;
}

export function getPoolOrThrow(id: Bytes): Pool {
    let pool = Pool.load(id);
    if (pool !== null) return pool;

    throw new Error(`Could not find pool ${id.toHex()}`);
}

export function createGauge(address: Address): void {
    let gauge = Gauge.load(address);
    if (gauge !== null) return;

    new Gauge(address).save();
}

export function getPositionId(poolAddress: Address, owner: Address): Bytes {
    return poolAddress.concat(owner);
}

export function getOrCreatePosition(
    poolAddress: Address,
    owner: Address,
): Position {
    let id = getPositionId(poolAddress, owner);
    let position = Position.load(id);
    if (position !== null) return position;

    position = new Position(id);
    position.owner = owner;
    position.liquidity = BI_0;
    position.pool = poolAddress;
    position.save();

    return position;
}

export function getPoolLpTokenAddressOrThrow(poolAddress: Address): Address {
    let lpTokenAddress = LEGACY_POOL_LP_TOKEN.get(poolAddress);
    if (lpTokenAddress !== null) return lpTokenAddress;

    return changetype<Address>(
        Address.fromHexString(getPoolOrThrow(poolAddress).lpToken._id),
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
