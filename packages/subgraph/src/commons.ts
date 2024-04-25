import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import {
    ClaimableFee,
    Campaign,
    Metrom,
    Reward,
    Token,
    Transaction,
    SpecificFee,
} from "../generated/schema";
import { METROM_ADDRESS } from "./addresses";
import { Erc20 } from "../generated/Metrom/Erc20";
import { Erc20BytesName } from "../generated/Metrom/Erc20BytesName";
import { Erc20BytesSymbol } from "../generated/Metrom/Erc20BytesSymbol";

export function getMetromOrThrow(): Metrom {
    let metrom = Metrom.load(METROM_ADDRESS);
    if (metrom != null) return metrom;

    throw new Error(
        `Could not find Metrom at address ${METROM_ADDRESS.toHex()}`,
    );
}

export function getCampaignOrThrow(id: Bytes): Campaign {
    let campaign = Campaign.load(id);
    if (campaign != null) return campaign;

    throw new Error(`Could not find campaign with id ${id.toHex()}`);
}

export function getRewardId(campaignId: Bytes, token: Bytes): Bytes {
    return campaignId.concat(token);
}

export function getRewardOrThrow(campaignId: Bytes, token: Bytes): Reward {
    let reward = Reward.load(getRewardId(campaignId, token));
    if (reward != null) return reward;

    throw new Error(
        `Could not find reward for token ${token.toHex()} on campaign with id ${campaignId.toHex()}`,
    );
}

export function getOrCreateSpecificFee(account: Address): SpecificFee {
    let specificFee = SpecificFee.load(account);
    if (specificFee !== null) return specificFee;

    specificFee = new SpecificFee(account);
    specificFee.metrom = METROM_ADDRESS;
    specificFee.address = account;
    specificFee.fee = BigInt.zero();
    specificFee.none = false;
    specificFee.save();
    return specificFee;
}

export function getOrCreateClaimableFee(token: Token): ClaimableFee {
    let claimableFee = ClaimableFee.load(token.id);
    if (claimableFee !== null) return claimableFee;

    claimableFee = new ClaimableFee(token.id);
    claimableFee.metrom = METROM_ADDRESS;
    claimableFee.token = token.id;
    claimableFee.amount = BigInt.zero();
    claimableFee.save();
    return claimableFee;
}

export function getClaimableFeeOrThrow(token: Token): ClaimableFee {
    let claimableFee = ClaimableFee.load(token.id);
    if (claimableFee != null) return claimableFee;

    throw new Error(
        `Could not find claimable fee for token ${token.id.toHex()}`,
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
