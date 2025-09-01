import { AccountAddress, Hex } from "@aptos-labs/ts-sdk";
import type {
    ClaimWithRemaining,
    ReimbursementsWithRemaining,
} from "../types/campaign";

export function buildRewardsFunctionArgs<
    T extends ClaimWithRemaining | ReimbursementsWithRemaining,
>(account: string, claims: T[]) {
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
        amounts.push(claim.remaining.raw);
        receivers.push(account);
    });

    return [campaignIds, proofs, tokens, amounts, receivers];
}
