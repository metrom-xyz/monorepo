import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import { Token } from "../generated/schema";
import { Erc20 } from "../generated/CurveRouter/Erc20";
import { Erc20BytesSymbol } from "../generated/CurveRouter/Erc20BytesSymbol";
import { Erc20BytesName } from "../generated/CurveRouter/Erc20BytesName";
import {
    NATIVE_TOKEN_ADDRESS,
    NATIVE_TOKEN_DECIMALS,
    NATIVE_TOKEN_NAME,
    NATIVE_TOKEN_SYMBOL,
} from "./constants";

export function getEventId(event: ethereum.Event): Bytes {
    return changetype<Bytes>(
        event.block.number.leftShift(40).plus(event.logIndex).reverse(),
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
    token.decimals = decimals.toI32();
    token.save();

    return token;
}
