import {
    Address,
    BigDecimal,
    BigInt,
    Bytes,
    ethereum,
} from "@graphprotocol/graph-ts";
import {
    Pool,
    Position,
    Token,
    Transaction,
    PoolToken,
    Block,
} from "../generated/schema";
import { Erc20 } from "../generated/Factory/Erc20";
import { Erc20BytesSymbol } from "../generated/Factory/Erc20BytesSymbol";
import { Erc20BytesName } from "../generated/Factory/Erc20BytesName";
import {
    NATIVE_TOKEN_ADDRESS,
    NATIVE_TOKEN_DECIMALS,
    NATIVE_TOKEN_NAME,
    NATIVE_TOKEN_SYMBOL,
} from "./addresses";

export const ADDRESS_ZERO = Address.zero();
export const BI_0 = BigInt.zero();
export const BI_1 = BigInt.fromI32(1);
export const BD_0 = BigDecimal.zero();
export const BD_10 = BigDecimal.fromString("10");

export function getEventId(event: ethereum.Event): Bytes {
    return changetype<Bytes>(
        event.block.number.leftShift(40).plus(event.logIndex).reverse(),
    );
}

function getOrCreateBlock(event: ethereum.Event): Block {
    let block = Block.load(event.block.hash);
    if (block !== null) return block;

    block = new Block(event.block.hash);
    block.number = event.block.number;
    block.timestamp = event.block.timestamp;
    block.save();

    return block;
}

export function getOrCreateTransaction(event: ethereum.Event): Transaction {
    let id = event.transaction.hash;
    let transaction = Transaction.load(id);
    if (transaction != null) return transaction;

    transaction = new Transaction(id);
    transaction.block = getOrCreateBlock(event).id;
    transaction.save();

    return transaction;
}

export function getPoolOrThrow(address: Address): Pool {
    let pool = Pool.load(address);
    if (pool != null) return pool;

    throw new Error(`Could not find pool with address ${address.toHex()}`);
}

export function getOrCreatePosition(
    poolAddress: Address,
    owner: Address,
): Position {
    let id = poolAddress.concat(owner);
    let position = Position.load(id);
    if (position != null) return position;

    let pool = getPoolOrThrow(poolAddress);

    position = new Position(id);
    position.owner = owner;
    position.liquidity = BI_0;
    position.pool = pool.id;
    position.save();

    return position;
}

export function getPositionOrThrow(
    poolAddress: Address,
    owner: Address,
): Position {
    let id = poolAddress.concat(owner);
    let position = Position.load(id);
    if (position != null) return position;

    throw new Error(
        `Could not find position on pool ${poolAddress.toHex()} for owner ${owner.toHex()}`,
    );
}

export function getTokenOrThrow(address: Address): Token {
    let token = Token.load(address);
    if (token != null) return token;

    throw new Error(`Could not find token with address ${address.toHex()}`);
}

function getPoolTokenId(poolAddress: Address, tokenAddress: Address): Bytes {
    return poolAddress.concat(tokenAddress);
}

export function getSortedPoolTokens(pool: Pool): PoolToken[] {
    let sortedPoolTokenIds = pool.tokens.sort((a, b) => {
        for (let i = 0; i < 40; i++) {
            let aByte = a[i];
            let bByte = b[i];

            if (aByte < bByte) {
                return -1;
            } else if (aByte > bByte) {
                return 1;
            }
        }
        return 0;
    });

    let poolToken0Id = sortedPoolTokenIds[0];
    let poolToken0 = PoolToken.load(poolToken0Id);
    if (poolToken0 == null)
        throw new Error(`Could not find pool token 0 with id ${poolToken0Id}`);

    let poolToken1Id = sortedPoolTokenIds[1];
    let poolToken1 = PoolToken.load(poolToken1Id);
    if (poolToken1 == null)
        throw new Error(`Could not find pool token 1 with id ${poolToken1Id}`);

    if (sortedPoolTokenIds.length === 2) return [poolToken0, poolToken1];

    let poolToken2Id = sortedPoolTokenIds[2];
    let poolToken2 = PoolToken.load(poolToken2Id);
    if (poolToken2 == null)
        throw new Error(`Could not find pool token 2 with id ${poolToken2Id}`);

    return [poolToken0, poolToken1, poolToken2];
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

    if (address == NATIVE_TOKEN_ADDRESS) {
        token = new Token(NATIVE_TOKEN_ADDRESS);
        token.symbol = NATIVE_TOKEN_SYMBOL;
        token.name = NATIVE_TOKEN_NAME;
        token.decimals = NATIVE_TOKEN_DECIMALS;
        token.save();
        return token;
    }

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

export function getOrCreatePoolToken(
    poolAddress: Address,
    tokenAddress: Address,
): PoolToken | null {
    let id = getPoolTokenId(poolAddress, tokenAddress);
    let poolToken = PoolToken.load(id);
    if (poolToken !== null) return poolToken;

    poolToken = new PoolToken(id);
    poolToken.data = tokenAddress;
    poolToken.tvl = BI_0;
    poolToken.save();

    return poolToken;
}
