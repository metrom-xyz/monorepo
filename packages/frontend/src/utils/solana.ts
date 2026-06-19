import {
    appendTransactionMessageInstructions,
    compileTransaction,
    createTransactionMessage,
    getBase64EncodedWireTransaction,
    pipe,
    setTransactionMessageFeePayerSigner,
    setTransactionMessageLifetimeUsingBlockhash,
    type Blockhash,
    type Instruction,
    type TransactionSigner,
} from "@solana/kit";

export const MAX_BASE64_TX_SIZE = 1644;

interface BuildTransactionParams {
    signer: TransactionSigner;
    blockHash: Readonly<{
        blockhash: Blockhash;
        lastValidBlockHeight: bigint;
    }>;
    instructions: Instruction[];
}

export function buildSolanaTransaction({
    signer,
    blockHash,
    instructions,
}: BuildTransactionParams) {
    return pipe(
        createTransactionMessage({ version: 0 }),
        (tx) => setTransactionMessageFeePayerSigner(signer, tx),
        (tx) => setTransactionMessageLifetimeUsingBlockhash(blockHash, tx),
        (tx) => appendTransactionMessageInstructions(instructions, tx),
    );
}

type BuildSolanaTransactionBatchesParams = BuildTransactionParams;

export function buildSolanaTransactionBatches({
    signer,
    blockHash,
    instructions,
}: BuildSolanaTransactionBatchesParams) {
    const batches = [];

    let pending: Instruction[] = [];
    for (const instruction of instructions) {
        const candidate = [...pending, instruction];
        const size = getBase64EncodedWireTransaction(
            compileTransaction(
                buildSolanaTransaction({
                    signer,
                    blockHash,
                    instructions: candidate,
                }),
            ),
        ).length;

        if (size > MAX_BASE64_TX_SIZE && pending.length > 0) {
            batches.push(
                buildSolanaTransaction({
                    signer,
                    blockHash,
                    instructions: pending,
                }),
            );
            pending = [instruction];
        } else pending = candidate;
    }

    if (pending.length)
        batches.push(
            buildSolanaTransaction({
                signer,
                blockHash,
                instructions: pending,
            }),
        );

    return batches;
}
