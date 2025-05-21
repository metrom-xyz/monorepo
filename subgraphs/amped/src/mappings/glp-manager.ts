import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { Erc20 } from "../../generated/Vault/Erc20";
import { Erc20BytesSymbol } from "../../generated/Vault/Erc20BytesSymbol";
import { Erc20BytesName } from "../../generated/Vault/Erc20BytesName";
import { Collateral, LiquidityChange, Position } from "../../generated/schema";
import { BI_0, getEventId } from "../commons";
import {
    AddLiquidity,
    RemoveLiquidity,
} from "../../generated/GlpManager/GlpManager";

export function fetchTokenSymbolOrThrow(address: Address): string {
    let contract = Erc20.bind(address);
    let result = contract.try_symbol();
    if (!result.reverted) return result.value;

    let bytesContract = Erc20BytesSymbol.bind(address);
    let bytesResult = bytesContract.try_symbol();
    if (!bytesResult.reverted) return bytesResult.value.toString();

    throw new Error(
        `Could not fetch ERC20 token symbol for ${address.toHex()}`,
    );
}

export function fetchTokenNameOrThrow(address: Address): string {
    let contract = Erc20.bind(address);
    let result = contract.try_name();
    if (!result.reverted) return result.value;

    let bytesContract = Erc20BytesName.bind(address);
    let bytesResult = bytesContract.try_name();
    if (!bytesResult.reverted) return bytesResult.value.toString();

    throw new Error(`Could not fetch ERC20 token name for ${address.toHex()}`);
}

export function fetchTokenDecimalsOrThrow(address: Address): BigInt {
    let contract = Erc20.bind(address);
    let result = contract.try_decimals();
    if (!result.reverted) return result.value;

    throw new Error(
        `Could not fetch ERC20 token decimals for ${address.toHex()}`,
    );
}

function getOrCreateCollateral(address: Address): Collateral {
    let collateral = Collateral.load(address);
    if (collateral !== null) return collateral;

    collateral = new Collateral(address);
    collateral.name = fetchTokenNameOrThrow(address);
    collateral.symbol = fetchTokenSymbolOrThrow(address);
    collateral.decimals = fetchTokenDecimalsOrThrow(address);
    collateral.liquidity = BI_0;
    collateral.save();

    return collateral;
}

function getOrCreatePosition(owner: Address, collateral: Address): Position {
    let position = Position.load(owner);
    if (position !== null) return position;

    position = new Position(owner);
    position.liquidity = BI_0;
    position.collateral = collateral;
    position.save();

    return position;
}

function handlePositionChange(
    event: ethereum.Event,
    ownerAddress: Address,
    collateralAddress: Address,
    liquidityDelta: BigInt,
): void {
    let collateral = getOrCreateCollateral(collateralAddress);
    collateral.liquidity = collateral.liquidity.plus(liquidityDelta);
    collateral.save();

    let position = getOrCreatePosition(ownerAddress, collateralAddress);
    position.liquidity = position.liquidity.plus(liquidityDelta);
    position.collateral = collateralAddress;
    position.save();

    let change = new LiquidityChange(getEventId(event));
    change.timestamp = event.block.timestamp;
    change.position = position.id;
    change.delta = liquidityDelta;
    change.save();
}

export function handleAddLiquidity(event: AddLiquidity): void {
    handlePositionChange(
        event,
        event.params.account,
        event.params.token,
        event.params.mintAmount,
    );
}

export function handleRemoveLiquidity(event: RemoveLiquidity): void {
    handlePositionChange(
        event,
        event.params.account,
        event.params.token,
        event.params.glpAmount.neg(),
    );
}
