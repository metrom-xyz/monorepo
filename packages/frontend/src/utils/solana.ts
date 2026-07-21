import {
    createTransactionMessage,
    createTransactionPlanner,
    parallelInstructionPlan,
    pipe,
    setTransactionMessageFeePayerSigner,
    setTransactionMessageLifetimeUsingBlockhash,
    type Blockhash,
    type Instruction,
    type InstructionPlan,
    type TransactionPlan,
    type TransactionSigner,
} from "@solana/kit";

export type LatestBlockhash = Readonly<{
    blockhash: Blockhash;
    lastValidBlockHeight: bigint;
}>;

export function buildSolanaClaimInstructionPlan(
    instructions: Instruction[],
): InstructionPlan {
    return parallelInstructionPlan(instructions);
}

interface BuildSolanaTransactionPlanParams {
    instructionPlan: InstructionPlan;
    signer: TransactionSigner;
    getLatestBlockhash: () => Promise<LatestBlockhash> | LatestBlockhash;
}

export function buildSolanaTransactionPlan({
    instructionPlan,
    signer,
    getLatestBlockhash,
}: BuildSolanaTransactionPlanParams): Promise<TransactionPlan> {
    const planner = createTransactionPlanner({
        createTransactionMessage: async () => {
            const blockHash = await getLatestBlockhash();
            return pipe(
                createTransactionMessage({ version: 0 }),
                (tx) => setTransactionMessageFeePayerSigner(signer, tx),
                (tx) =>
                    setTransactionMessageLifetimeUsingBlockhash(blockHash, tx),
            );
        },
    });

    return planner(instructionPlan);
}
