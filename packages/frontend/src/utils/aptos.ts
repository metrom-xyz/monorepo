import { AccountAddress, Hex } from "@aptos-labs/ts-sdk";
import type { Claim, Reimbursement } from "@metrom-xyz/sdk";

export function buildRewardsFunctionArgs<T extends Claim | Reimbursement>(
    account: string,
    claims: T[],
) {
    const campaignIds: Uint8Array[] = [];
    const proofs: Uint8Array[][] = [];
    const tokens: string[] = [];
    const amounts: bigint[] = [];
    const receivers: string[] = [];

    claims.forEach((claim) => {
        campaignIds.push(
            AccountAddress.fromString(claim.campaignId).bcsToBytes(),
        );
        proofs.push(
            claim.proof.map((proof) => Hex.fromHexInput(proof).toUint8Array()),
        );
        tokens.push(claim.token.address);
        amounts.push(claim.amount.raw);
        receivers.push(account);
    });

    return [campaignIds, proofs, tokens, amounts, receivers];
}
