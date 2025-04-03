import {
    Address,
    BigDecimal,
    BigInt,
    Bytes,
    crypto,
    ethereum,
} from "@graphprotocol/graph-ts";
import {
    LiquidityChange,
    Pool,
    PoolTemplate,
    Position,
    Tick,
    TickChange,
    Token,
} from "../generated/schema";
import { Erc20 } from "../generated/CrocSwapDex/Erc20";
import { Erc20BytesSymbol } from "../generated/CrocSwapDex/Erc20BytesSymbol";
import { Erc20BytesName } from "../generated/CrocSwapDex/Erc20BytesName";
import {
    CROC_QUERY_ADDRESS,
    NATIVE_TOKEN_ADDRESS,
    NATIVE_TOKEN_DECIMALS,
    NATIVE_TOKEN_NAME,
    NATIVE_TOKEN_SYMBOL,
} from "./addresses";
import { CrocQuery } from "../generated/CrocSwapDex/CrocQuery";

export const BI_0 = BigInt.zero();
export const BI_1_000_000 = BigInt.fromI32(1_000_000);

export const BD_0 = BigDecimal.zero();
export const BD_Q192 = BigDecimal.fromString(
    BigInt.fromI32(2)
        .pow(192 as u8)
        .toString(),
);

const CROC_ADDR_PREFIX = "0xaaaaaaa";

const CrocQueryContract = CrocQuery.bind(CROC_QUERY_ADDRESS);

export function decodeAbiOrThrow(
    signature: string,
    encoded: Bytes,
): ethereum.Tuple {
    let decoded = ethereum.decode(signature, encoded);
    if (decoded === null)
        throw new Error(`Could not decode data ${encoded.toHex()}`);
    return decoded.toTuple();
}
export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
    let result = "1";

    for (let i = 0; i < decimals.toI32(); i++) {
        result += "0";
    }

    return BigDecimal.fromString(result);
}

export function getPoolId(
    token0: Address,
    token1: Address,
    idx: BigInt,
): Bytes {
    let encoded = ethereum.encode(
        ethereum.Value.fromTuple(
            changetype<ethereum.Tuple>([
                ethereum.Value.fromAddress(token0),
                ethereum.Value.fromAddress(token1),
                ethereum.Value.fromUnsignedBigInt(idx),
            ]),
        ),
    )!;
    return Bytes.fromByteArray(crypto.keccak256(encoded));
}

export function getPoolOrThrow(id: Bytes): Pool {
    let pool = Pool.load(id);
    if (pool !== null) return pool;

    throw new Error(`Could not find pool with id ${id.toHex()}`);
}

export function getPoolTemplateId(idx: BigInt): Bytes {
    return Bytes.fromByteArray(Bytes.fromBigInt(idx));
}

export function getPoolTemplateOrThrow(idx: BigInt): PoolTemplate {
    let id = getPoolTemplateId(idx);
    let template = PoolTemplate.load(id);
    if (template != null) return template;

    throw new Error(`Could not find pool template with id ${id.toHex()}`);
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

function getBlockEventId(block: ethereum.Block, entityId: Bytes): Bytes {
    return entityId.concat(Bytes.fromByteArray(Bytes.fromBigInt(block.number)));
}

export function handleSwap(
    block: ethereum.Block,
    poolId: Bytes,
    token0Delta: BigInt,
    token1Delta: BigInt,
): void {
    let pool = getPoolOrThrow(poolId);

    pool.token0Tvl = pool.token0Tvl.plus(token0Delta);
    pool.token1Tvl = pool.token1Tvl.plus(token1Delta);
    if (!token0Delta.isZero())
        pool.price = BigDecimal.fromString(token1Delta.abs().toString()).div(
            BigDecimal.fromString(token0Delta.abs().toString()),
        );
    pool.save();

    let tickChangeId = getBlockEventId(block, pool.id);
    if (TickChange.loadInBlock(tickChangeId) === null) {
        let newTick = CrocQueryContract.queryCurveTick(
            changetype<Address>(pool.token0),
            changetype<Address>(pool.token1),
            pool.idx,
        );
        if (pool.tick != newTick) {
            let tickChange = new TickChange(tickChangeId);
            tickChange.timestamp = block.timestamp;
            tickChange.pool = pool.id;
            tickChange.newTick = newTick;
            tickChange.save();

            pool.tick = newTick;
            pool.save();
        }
    }
}

export function handleLiquidityChange(
    block: ethereum.Block,
    transaction: ethereum.Transaction,
    poolId: Bytes,
    lowerTickIdx: i32,
    upperTickIdx: i32,
    ambient: bool,
    token0Delta: BigInt,
    token1Delta: BigInt,
): void {
    let pool = getPoolOrThrow(poolId);
    pool.token0Tvl = pool.token0Tvl.plus(token0Delta);
    pool.token1Tvl = pool.token1Tvl.plus(token1Delta);

    let transactionFrom = transaction.from;
    let transactionTo = transaction.to;

    let owner: Address;
    if (transactionTo === null) owner = transactionFrom;
    else if (
        transactionTo.toHexString().toLowerCase().startsWith(CROC_ADDR_PREFIX)
    )
        owner = transactionFrom;
    else owner = transactionTo;

    let positionId = Bytes.fromByteArray(
        crypto.keccak256(
            pool.id
                .concat(owner)
                .concat(Bytes.fromI32(lowerTickIdx))
                .concat(Bytes.fromI32(upperTickIdx)),
        ),
    );

    let position = Position.load(positionId);
    if (position == null) {
        position = new Position(positionId);
        position.owner = owner;
        position.lowerTick = ambient ? 0 : lowerTickIdx;
        position.upperTick = ambient ? 0 : upperTickIdx;
        position.concentratedLiquidity = BI_0;
        position.ambientLiquidity = BI_0;
        position.pool = pool.id;
    }

    let liquidityDelta: BigInt;
    if (ambient) {
        let call = CrocQueryContract.try_queryAmbientTokens(
            owner,
            changetype<Address>(pool.token0),
            changetype<Address>(pool.token1),
            pool.idx,
        );
        let newLiquidity = call.reverted ? BI_0 : call.value.getLiq();
        pool.ambientLiquidity = newLiquidity;
        liquidityDelta = newLiquidity.minus(position.ambientLiquidity);
    } else {
        let call = CrocQueryContract.try_queryRangeTokens(
            owner,
            changetype<Address>(pool.token0),
            changetype<Address>(pool.token1),
            pool.idx,
            lowerTickIdx,
            upperTickIdx,
        );
        let newLiquidity = call.reverted ? BI_0 : call.value.getLiq();
        pool.concentratedLiquidity = newLiquidity;
        liquidityDelta = newLiquidity.minus(position.concentratedLiquidity);

        let lowerTick = getOrCreateTick(pool.id, lowerTickIdx);
        lowerTick.liquidityGross =
            lowerTick.liquidityGross.plus(liquidityDelta);
        lowerTick.liquidityNet = lowerTick.liquidityNet.plus(liquidityDelta);
        lowerTick.save();

        let upperTick = getOrCreateTick(pool.id, upperTickIdx);
        upperTick.liquidityGross =
            upperTick.liquidityGross.plus(liquidityDelta);
        upperTick.liquidityNet = upperTick.liquidityNet.minus(liquidityDelta);
        upperTick.save();
    }

    pool.save();

    if (!liquidityDelta.isZero()) {
        let liquidityChangeId = getBlockEventId(block, position.id);
        if (LiquidityChange.loadInBlock(liquidityChangeId) === null) {
            let liquidityChange = new LiquidityChange(liquidityChangeId);
            liquidityChange.timestamp = block.timestamp;
            liquidityChange.concentratedDelta = ambient ? BI_0 : liquidityDelta;
            liquidityChange.ambientDelta = ambient ? liquidityDelta : BI_0;
            liquidityChange.position = positionId;
            liquidityChange.save();
        }

        if (ambient)
            position.ambientLiquidity =
                position.ambientLiquidity.plus(liquidityDelta);
        else
            position.concentratedLiquidity =
                position.concentratedLiquidity.plus(liquidityDelta);

        position.save();
    }
}

export function getOrCreateTick(poolAddress: Bytes, idx: i32): Tick {
    let id = poolAddress.concat(Bytes.fromI32(idx));
    let tick = Tick.load(id);
    if (tick !== null) {
        return tick;
    }

    tick = new Tick(id);
    tick.idx = idx;
    tick.pool = poolAddress;
    tick.liquidityGross = BI_0;
    tick.liquidityNet = BI_0;
    tick.save();

    return tick;
}
