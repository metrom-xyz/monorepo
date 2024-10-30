import {
    Address,
    BigDecimal,
    BigInt,
    Bytes,
    ethereum,
} from "@graphprotocol/graph-ts";
import {
    Block,
    Pool,
    PoolToken,
    Token,
    Transaction,
} from "../generated/schema";
import { NonFungiblePositionManager } from "../generated/NonFungiblePositionManager/NonFungiblePositionManager";
import { Factory } from "../generated/Factory/Factory";
import {
    FACTORY_ADDRESS,
    NON_FUNGIBLE_POSITION_MANAGER_ADDRESS,
} from "./addresses";
import { Erc20 } from "../generated/Factory/Erc20";
import { Erc20BytesSymbol } from "../generated/Factory/Erc20BytesSymbol";
import { Erc20BytesName } from "../generated/Factory/Erc20BytesName";

export const BI_0 = BigInt.zero();
export const BI_1 = BigInt.fromI32(1);
export const BD_10 = BigDecimal.fromString("10");

export const NonFungiblePositionManagerContract =
    NonFungiblePositionManager.bind(NON_FUNGIBLE_POSITION_MANAGER_ADDRESS);
export const FactoryContract = Factory.bind(FACTORY_ADDRESS);

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

    return [poolToken0, poolToken1];
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
