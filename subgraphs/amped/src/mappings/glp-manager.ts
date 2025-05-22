import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { Erc20 } from "../../generated/Vault/Erc20";
import { Erc20BytesSymbol } from "../../generated/Vault/Erc20BytesSymbol";
import { Erc20BytesName } from "../../generated/Vault/Erc20BytesName";
import { Collateral, SizeChange, Position } from "../../generated/schema";
import { BI_0, getEventId } from "../commons";
import {
    AddLiquidity,
    RemoveLiquidity,
} from "../../generated/GlpManager/GlpManager";

const BI_10_E_18 = BigInt.fromI32(10).pow(18);

export function fetchTokenSymbolOrThrow(address: Address): string {
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

export function fetchTokenNameOrThrow(address: Address): string {
    const contract = Erc20.bind(address);
    const result = contract.try_name();
    if (!result.reverted) return result.value;

    const bytesContract = Erc20BytesName.bind(address);
    const bytesResult = bytesContract.try_name();
    if (!bytesResult.reverted) return bytesResult.value.toString();

    throw new Error(`Could not fetch ERC20 token name for ${address.toHex()}`);
}

export function fetchTokenDecimalsOrThrow(address: Address): i32 {
    const contract = Erc20.bind(address);
    const result = contract.try_decimals();
    if (!result.reverted) return result.value.toI32();

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
    collateral.size = BI_0;
    collateral.save();

    return collateral;
}

function getOrCreatePosition(owner: Address, collateral: Address): Position {
    const id = collateral.concat(owner);
    let position = Position.load(id);
    if (position !== null) return position;

    position = new Position(id);
    position.owner = owner;
    position.size = BI_0;
    position.collateral = collateral;
    position.save();

    return position;
}

function handleLiquidityChange(
    event: ethereum.Event,
    ownerAddress: Address,
    collateralAddress: Address,
    usdgAmount: BigInt,
    glpDelta: BigInt,
): void {
    const sizeDelta = usdgAmount.times(BI_10_E_18).div(glpDelta);

    const collateral = getOrCreateCollateral(collateralAddress);
    collateral.size = collateral.size.plus(sizeDelta);
    collateral.save();

    const position = getOrCreatePosition(ownerAddress, collateralAddress);
    position.size = position.size.plus(sizeDelta);
    position.save();

    const change = new SizeChange(getEventId(event));
    change.timestamp = event.block.timestamp;
    change.position = position.id;
    change.delta = sizeDelta;
    change.save();
}

export function handleAddLiquidity(event: AddLiquidity): void {
    handleLiquidityChange(
        event,
        event.params.account,
        event.params.token,
        event.params.usdgAmount,
        event.params.mintAmount,
    );
}

export function handleRemoveLiquidity(event: RemoveLiquidity): void {
    handleLiquidityChange(
        event,
        event.params.account,
        event.params.token,
        event.params.usdgAmount,
        event.params.glpAmount,
    );
}
