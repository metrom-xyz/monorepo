import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import { Position, Strategy, StrategyAsset, Token } from "../generated/schema";
import { Erc20 } from "../generated/Factory/Erc20";
import { Erc20BytesSymbol } from "../generated/Factory/Erc20BytesSymbol";
import { Erc20BytesName } from "../generated/Factory/Erc20BytesName";
import { Position as PositionContract } from "../generated/templates/Position/Position";

export const ADDRESS_ZERO = Address.zero();

export const BI_0 = BigInt.zero();

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

export function getPositionOrThrow(id: Address): Position {
    const position = Position.load(id);
    if (position === null)
        throw new Error(`Could not find position with id ${id.toHex()}`);
    return position;
}

export function updatePositionAndStrategyAssetDataAndSave(
    position: Position,
    block: ethereum.Block,
): void {
    if (position._updatedAtBlock === block.number) return;

    const contract = PositionContract.bind(changetype<Address>(position.id));

    const borrowTokenAddress = contract.borrowToken();
    if (borrowTokenAddress !== ADDRESS_ZERO)
        if (getOrCreateToken(borrowTokenAddress) === null)
            throw new Error(
                `Could not resolve ERC20 token at address ${borrowTokenAddress.toHex()}`,
            );

    const previouslyAllocated = position.totalAllocated;
    const previouslyDeposited = position.totalDeposited;

    position.totalAllocated = contract.totalAllocated();
    position.totalDeposited = contract.depositedAmount();
    position.borrowToken = borrowTokenAddress;
    position.totalBorrowed = contract.borrowedAmount();
    position._updatedAtBlock = block.number;
    position.save();

    const allocatedDelta = position.totalAllocated.minus(previouslyAllocated);
    const depositedDelta = position.totalDeposited.minus(previouslyDeposited);

    const strategyAsset = getOrCreateStrategyAsset(
        position.strategy,
        changetype<Address>(position.asset),
    );
    strategyAsset.totalAllocated =
        strategyAsset.totalAllocated.plus(allocatedDelta);
    strategyAsset.totalDeposited =
        strategyAsset.totalDeposited.plus(depositedDelta);
    strategyAsset.save();
}

export function getStrategyOrThrow(id: i64): Strategy {
    const strategy = Strategy.load(id);
    if (strategy === null)
        throw new Error(`Could not find strategy with id ${id.toString()}`);
    return strategy;
}

export function getStrategyAssetId(rawStrategyId: i64, asset: Bytes): Bytes {
    return asset.concat(Bytes.fromByteArray(Bytes.fromI64(rawStrategyId)));
}

export function getOrCreateStrategyAsset(
    rawStrategyId: i64,
    asset: Bytes,
): StrategyAsset {
    let id = getStrategyAssetId(rawStrategyId, asset);
    let strategyAsset = StrategyAsset.load(id);
    if (strategyAsset === null) {
        strategyAsset = new StrategyAsset(id);

        if (getOrCreateToken(changetype<Address>(asset)) === null)
            throw new Error(`Could not create asset ${asset}`);

        strategyAsset.asset = asset;
        strategyAsset.strategy = rawStrategyId;
        strategyAsset.totalAllocated = BI_0;
        strategyAsset.totalDeposited = BI_0;
        strategyAsset.save();
    }
    return strategyAsset;
}

export function getStrategyAssetOrThrow(
    rawStrategyId: i64,
    asset: Bytes,
): StrategyAsset {
    const strategyAsset = StrategyAsset.load(
        getStrategyAssetId(rawStrategyId, asset),
    );
    if (strategyAsset === null)
        throw new Error(
            `Could not find asset ${asset.toHex()} for strategy with id ${rawStrategyId.toString()}`,
        );
    return strategyAsset;
}
