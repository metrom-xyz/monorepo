import type { Claim } from "@metrom-xyz/sdk";
import { type Address, hexToBytes } from "viem";

export function buildRewardsFunctionArgs<T extends Claim>(
    account: Address,
    claims: T[],
) {
    const campaignIds: Uint8Array[] = [];
    const proofs: Uint8Array[][] = [];
    const tokens: Address[] = [];
    const amounts: bigint[] = [];
    const receivers: Address[] = [];

    claims.forEach((claim) => {
        campaignIds.push(hexToBytes(claim.campaignId));
        proofs.push(claim.proof.map((proof) => hexToBytes(proof)));
        tokens.push(claim.token.address);
        amounts.push(claim.amount.raw);
        receivers.push(account);
    });

    return [campaignIds, proofs, tokens, amounts, receivers];
}
