import { useCallback } from "react";
import { useSolanaClient } from "@solana/react-hooks";
import {
    createTransactionPlanExecutor,
    flattenTransactionPlan,
    getBase64EncodedWireTransaction,
    passthroughFailedTransactionPlanExecution,
    sequentialTransactionPlan,
    signTransactionMessageWithSigners,
    summarizeTransactionPlanResult,
    type InstructionPlan,
    type TransactionPlanResultSummary,
    type TransactionSigner,
} from "@solana/kit";
import { useSolanaTransactionSignature } from "./useSolanaTransactionSignature";
import { buildSolanaTransactionPlan } from "../utils/solana";

interface ExecuteSolanaTransactionPlanParams {
    instructionPlan: InstructionPlan;
    signer: TransactionSigner;
}

interface UseExecuteSolanaTransactionPlanReturnValue {
    execute: (
        params: ExecuteSolanaTransactionPlanParams,
    ) => Promise<TransactionPlanResultSummary>;
}

export function useExecuteSolanaTransactionPlan(): UseExecuteSolanaTransactionPlanReturnValue {
    const client = useSolanaClient();
    const { waitForConfirmationAsync } = useSolanaTransactionSignature();

    const execute = useCallback(
        async ({
            instructionPlan,
            signer,
        }: ExecuteSolanaTransactionPlanParams) => {
            const transactionPlan = await buildSolanaTransactionPlan({
                instructionPlan,
                signer,
                getLatestBlockhash: async () => {
                    const { value } = await client.runtime.rpc
                        .getLatestBlockhash()
                        .send();
                    return value;
                },
            });

            const executor = createTransactionPlanExecutor({
                executeTransactionMessage: async (_, message) => {
                    const signedTransaction =
                        await signTransactionMessageWithSigners(message);

                    const signature = await client.runtime.rpc
                        .sendTransaction(
                            getBase64EncodedWireTransaction(signedTransaction),
                            { encoding: "base64" },
                        )
                        .send();

                    await waitForConfirmationAsync(signature);
                    return signature;
                },
            });

            // Execute sequentially even though the plan was packed as
            // parallel-safe: some wallets (for example MetaMask) don't
            // queue concurrent signing requests correctly and silently drop
            // an already-approved transaction when a second request arrives
            // before the first is resolved.
            const sequentialPlan = sequentialTransactionPlan(
                flattenTransactionPlan(transactionPlan).map(
                    (batch) => batch.message,
                ),
            );

            const result = await passthroughFailedTransactionPlanExecution(
                executor(sequentialPlan),
            );

            return summarizeTransactionPlanResult(result);
        },
        [client.runtime.rpc, waitForConfirmationAsync],
    );

    return { execute };
}
