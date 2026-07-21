import { useEffect, useState } from "react";
import { useSolanaClient } from "@solana/react-hooks";
import {
    compileTransaction,
    flattenTransactionPlan,
    getBase64EncodedWireTransaction,
    type Blockhash,
    type Instruction,
    type InstructionPlan,
    type TransactionSigner,
} from "@solana/kit";
import type { HookBaseParams } from "../types/hooks";
import {
    buildSolanaClaimInstructionPlan,
    buildSolanaTransactionPlan,
} from "../utils/solana";

interface UseSimulateSolanaTransactionsParams extends HookBaseParams {
    instructions: Instruction[] | undefined;
    signer: TransactionSigner | undefined;
    blockHash:
        | Readonly<{
              blockhash: Blockhash;
              lastValidBlockHeight: bigint;
          }>
        | undefined;
}

interface UseSimulateSolanaTransactionsReturnValue {
    instructionPlan: InstructionPlan | undefined;
    transactionCount: number;
    simulating: boolean;
    errored: boolean;
}

export function useSimulateSolanaTransactions({
    instructions,
    signer,
    blockHash,
    enabled = true,
}: UseSimulateSolanaTransactionsParams): UseSimulateSolanaTransactionsReturnValue {
    const [instructionPlan, setInstructionPlan] = useState<InstructionPlan>();
    const [transactionCount, setTransactionCount] = useState(0);
    const [simulating, setSimulating] = useState(false);
    const [errored, setErrored] = useState(false);

    const client = useSolanaClient();

    useEffect(() => {
        if (
            !enabled ||
            !instructions ||
            instructions.length === 0 ||
            !signer ||
            !blockHash
        ) {
            setInstructionPlan(undefined);
            setTransactionCount(0);
            setSimulating(false);
            setErrored(false);
            return;
        }

        let cancelled = false;

        const simulate = async () => {
            setSimulating(true);
            setErrored(false);
            setInstructionPlan(undefined);
            setTransactionCount(0);

            try {
                const plan = buildSolanaClaimInstructionPlan(instructions);
                const transactionPlan = await buildSolanaTransactionPlan({
                    instructionPlan: plan,
                    signer,
                    getLatestBlockhash: () => blockHash,
                });

                const batches = flattenTransactionPlan(transactionPlan);

                const results = await Promise.allSettled(
                    batches.map((batch) => {
                        const wire = getBase64EncodedWireTransaction(
                            compileTransaction(batch.message),
                        );
                        return client.runtime.rpc
                            .simulateTransaction(wire, {
                                encoding: "base64",
                                sigVerify: false,
                            })
                            .send();
                    }),
                );

                let failed = false;
                for (const result of results) {
                    if (result.status === "rejected") {
                        console.warn("Simulation failed", result.reason);
                        failed = true;
                    } else if (result.value.value.err) {
                        console.warn(
                            "Simulation failed",
                            result.value.value.err,
                        );
                        failed = true;
                    }
                }

                if (cancelled) return;

                if (failed) {
                    setErrored(true);
                    return;
                }

                setInstructionPlan(plan);
                setTransactionCount(batches.length);
            } catch (error) {
                console.warn("Error during simulation", error);
                if (!cancelled) setErrored(true);
            } finally {
                if (!cancelled) setSimulating(false);
            }
        };

        void simulate();
        return () => {
            cancelled = true;
        };
    }, [enabled, instructions, signer, blockHash, client]);

    return { instructionPlan, transactionCount, simulating, errored };
}
