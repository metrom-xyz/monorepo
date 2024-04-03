import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import {
    Campaign,
    Factory,
    Reward,
    Token,
    Transaction,
} from "../generated/schema";
import { FACTORY_ADDRESS } from "./addresses";
import { Erc20 } from "../generated/templates/Campaign/Erc20";
import { Erc20BytesName } from "../generated/templates/Campaign/Erc20BytesName";
import { Erc20BytesSymbol } from "../generated/templates/Campaign/Erc20BytesSymbol";

export function getFactoryOrThrow(): Factory {
    let factory = Factory.load(FACTORY_ADDRESS);
    if (factory != null) return factory;

    throw new Error(
        `Could not find factory with address ${FACTORY_ADDRESS.toHex()}`,
    );
}

export function getCampaignOrThrow(address: Address): Campaign {
    let campaign = Campaign.load(address);
    if (campaign != null) return campaign;

    throw new Error(`Could not find campaign with address ${address.toHex()}`);
}

export function getRewardId(campaign: Address, token: Address): Bytes {
    return campaign.concat(token);
}

// this is the string "initial" encoded with utf-8
const INITIAL_REWARD_ID_PREFIX = Bytes.fromHexString("0x696e697469616c");

export function getInitialRewardId(campaign: Address, token: Address): Bytes {
    return INITIAL_REWARD_ID_PREFIX.concat(getRewardId(campaign, token));
}

export function getRewardOrThrow(campaign: Address, token: Address): Reward {
    let reward = Reward.load(getRewardId(campaign, token));
    if (reward != null) return reward;

    throw new Error(
        `Could not find reward for token ${token.toHex()} on campaign ${campaign.toHex()}`,
    );
}

export function getOrCreateTransaction(event: ethereum.Event): Transaction {
    let id = event.transaction.hash;
    let transaction = Transaction.load(id);
    if (transaction !== null) return transaction;

    transaction = new Transaction(id);
    transaction.blockNumber = event.block.number;
    transaction.timestamp = event.block.timestamp;
    transaction.save();
    return transaction;
}

export function getEventId(event: ethereum.Event): Bytes {
    return event.transaction.hash.concat(
        Bytes.fromByteArray(Bytes.fromBigInt(event.logIndex)),
    );
}

export function fetchTokenSymbol(address: Address): string {
    let contract = Erc20.bind(address);
    let result = contract.try_symbol();
    if (!result.reverted) return result.value;

    let bytesContract = Erc20BytesSymbol.bind(address);
    let bytesResult = bytesContract.try_symbol();
    if (!bytesResult.reverted) return bytesResult.value.toString();

    return "unknown";
}

export function fetchTokenName(address: Address): string {
    let contract = Erc20.bind(address);
    let result = contract.try_name();
    if (!result.reverted) return result.value;

    let bytesContract = Erc20BytesName.bind(address);
    let bytesResult = bytesContract.try_name();
    if (!bytesResult.reverted) return bytesResult.value.toString();

    return "unknown";
}

export function fetchTokenDecimals(address: Address): BigInt {
    let decimals = -1;

    let contract = Erc20.bind(address);
    let result = contract.try_decimals();
    if (!result.reverted) decimals = result.value;

    return BigInt.fromI32(decimals);
}

export function getOrCreateToken(address: Address): Token {
    let token = Token.load(address);
    if (token !== null) return token;

    token = new Token(address);
    token.symbol = fetchTokenSymbol(address);
    token.name = fetchTokenName(address);
    token.decimals = fetchTokenDecimals(address);
    token.save();

    return token;
}
