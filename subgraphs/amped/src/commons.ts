import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import { Erc20 } from "../generated/Vault/Erc20";
import { Erc20BytesSymbol } from "../generated/Vault/Erc20BytesSymbol";
import { Erc20BytesName } from "../generated/Vault/Erc20BytesName";
import { Collateral, Position } from "../generated/schema";
import { TOKENIZED_VAULT_COLLATERAL } from "./addresses";

export const ADDRESS_ZERO = Address.zero();
export const BI_0 = BigInt.zero();
export const BI_10E18 = BigInt.fromI32(10).pow(18);

export function getEventId(event: ethereum.Event): Bytes {
    return changetype<Bytes>(
        event.block.number.leftShift(40).plus(event.logIndex).reverse(),
    );
}

export function getEventIdFromCall(call: ethereum.Call): Bytes {
    return changetype<Bytes>(
        call.block.number.leftShift(40).plus(call.transaction.index).reverse(),
    );
}

export function getOrCreatePosition(owner: Address): Position {
    let position = Position.load(owner);
    if (position !== null) return position;

    position = new Position(owner);
    position.tvl = BI_0;
    position.scaledUsdValue = BI_0;
    position.tokenizedVault = TOKENIZED_VAULT_COLLATERAL.isSet(owner)
        ? owner
        : null;
    position.save();

    return position;
}

export function getPositionOrThrow(owner: Address): Position {
    let position = Position.load(owner);
    if (position !== null) return position;

    throw new Error(`Could not find position with owner ${owner.toHex()}`);
}

function fetchTokenSymbolOrThrow(address: Address): string {
    const contract = Erc20.bind(address);
    const result = contract.try_symbol();
    if (!result.reverted) return result.value;

    const bytesContract = Erc20BytesSymbol.bind(address);
    const bytesResult = bytesContract.try_symbol();
    if (!bytesResult.reverted) return bytesResult.value.toString();

    throw new Error(
        `Could not fetch ERC20 token symbol for ${address.toHex()}`,
    );
}

function fetchTokenNameOrThrow(address: Address): string {
    const contract = Erc20.bind(address);
    const result = contract.try_name();
    if (!result.reverted) return result.value;

    const bytesContract = Erc20BytesName.bind(address);
    const bytesResult = bytesContract.try_name();
    if (!bytesResult.reverted) return bytesResult.value.toString();

    throw new Error(`Could not fetch ERC20 token name for ${address.toHex()}`);
}

function fetchTokenDecimalsOrThrow(address: Address): i32 {
    const contract = Erc20.bind(address);
    const result = contract.try_decimals();
    if (!result.reverted) return result.value.toI32();

    throw new Error(
        `Could not fetch ERC20 token decimals for ${address.toHex()}`,
    );
}

export function getOrCreateCollateral(address: Address): Collateral {
    let collateral = Collateral.load(address);
    if (collateral !== null) return collateral;

    collateral = new Collateral(address);
    collateral.name = fetchTokenNameOrThrow(address);
    collateral.symbol = fetchTokenSymbolOrThrow(address);
    collateral.decimals = fetchTokenDecimalsOrThrow(address);
    collateral.usdTvl = BI_0;
    collateral.tvl = BI_0;
    collateral.save();

    return collateral;
}

export function getUsdTvlDeltaBasedOnPositionState(
    position: Position,
    tvlDelta: BigInt,
): BigInt {
    const positionAverageScaledAlpPrice = position.scaledUsdValue
        .times(BI_10E18)
        .div(position.tvl);
    return tvlDelta.times(positionAverageScaledAlpPrice).div(BI_10E18);
}
