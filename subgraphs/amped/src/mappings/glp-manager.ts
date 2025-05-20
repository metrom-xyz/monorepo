import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import { Erc20 } from "../../generated/Vault/Erc20";
import { Erc20BytesSymbol } from "../../generated/Vault/Erc20BytesSymbol";
import { Erc20BytesName } from "../../generated/Vault/Erc20BytesName";
import {
    Collateral,
    CollateralPosition,
    LiquidityChange,
    Position,
} from "../../generated/schema";
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
    collateral.tvl = BI_0;
    collateral.liquidity = BI_0;
    collateral.save();

    return collateral;
}

function getOrCreatePosition(owner: Address): Position {
    let position = Position.load(owner);
    if (position !== null) return position;

    position = new Position(owner);
    position.liquidity = BI_0;
    position.save();

    return position;
}

function getOrCreatePositionCollateral(
    owner: Address,
    collateral: Address,
): CollateralPosition {
    let id = changetype<Bytes>(owner.concat(collateral));
    let collateralPosition = CollateralPosition.load(id);
    if (collateralPosition !== null) return collateralPosition;

    collateralPosition = new CollateralPosition(id);
    collateralPosition.tvl = BI_0;
    collateralPosition.liquidity = BI_0;
    collateralPosition.collateral = collateral;
    collateralPosition.position = owner;
    collateralPosition.save();

    return collateralPosition;
}

function handlePositionChange(
    event: ethereum.Event,
    ownerAddress: Address,
    collateralAddress: Address,
    tvlDelta: BigInt,
    liquidityDelta: BigInt,
): void {
    let collateral = getOrCreateCollateral(collateralAddress);
    collateral.tvl = collateral.tvl.plus(tvlDelta);
    collateral.liquidity = collateral.liquidity.plus(liquidityDelta);
    collateral.save();

    let position = getOrCreatePosition(ownerAddress);
    position.liquidity = position.liquidity.plus(liquidityDelta);
    position.save();

    let collateralPosition = getOrCreatePositionCollateral(
        ownerAddress,
        collateralAddress,
    );
    collateralPosition.tvl = collateralPosition.tvl.plus(tvlDelta);
    collateralPosition.liquidity =
        collateralPosition.liquidity.plus(liquidityDelta);
    collateralPosition.save();

    let change = new LiquidityChange(getEventId(event));
    change.timestamp = event.block.timestamp;
    change.position = position.id;
    change.tvlDelta = tvlDelta;
    change.liquidityDelta = liquidityDelta;
    change.save();
}

export function handleAddLiquidity(event: AddLiquidity): void {
    handlePositionChange(
        event,
        event.params.account,
        event.params.token,
        event.params.amount,
        event.params.mintAmount,
    );
}

export function handleRemoveLiquidity(event: RemoveLiquidity): void {
    handlePositionChange(
        event,
        event.params.account,
        event.params.token,
        event.params.amountOut.neg(),
        event.params.glpAmount.neg(),
    );
}
