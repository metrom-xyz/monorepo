import { useEffect, useState } from "react";
import { useSolanaClient } from "@solana/react-hooks";
import {
    compileTransaction,
    getBase64EncodedWireTransaction,
    type Blockhash,
    type Instruction,
    type TransactionSigner,
} from "@solana/kit";
import type { HookBaseParams } from "../types/hooks";
import type { SolanaTxMessage } from "../types/solana";
import { buildSolanaTransactionBatches } from "../utils/solana";

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
    transactions: SolanaTxMessage[] | undefined;
    simulating: boolean;
    errored: boolean;
}

export function useSimulateSolanaTransactions({
    instructions,
    signer,
    blockHash,
    enabled = true,
}: UseSimulateSolanaTransactionsParams): UseSimulateSolanaTransactionsReturnValue {
    const [transactions, setTransactions] = useState<SolanaTxMessage[]>();
    const [simulating, setSimulating] = useState(false);
    const [errored, setErrored] = useState(false);

    const client = useSolanaClient();

    useEffect(() => {
        if (!enabled || !instructions || !signer || !blockHash) {
            setTransactions(undefined);
            setSimulating(false);
            setErrored(false);
            return;
        }

        let cancelled = false;

        const simulate = async () => {
            setSimulating(true);
            setErrored(false);
            setTransactions(undefined);

            try {
                const batches = buildSolanaTransactionBatches({
                    instructions,
                    signer,
                    blockHash,
                });

                for (const batch of batches) {
                    const wire = getBase64EncodedWireTransaction(
                        compileTransaction(batch),
                    );
                    const result = await client.runtime.rpc
                        .simulateTransaction(wire, {
                            encoding: "base64",
                            sigVerify: false,
                        })
                        .send();

                    if (result.value.err) {
                        console.warn("Simulation failed", result.value.err);
                        if (!cancelled) setErrored(true);
                        return;
                    }
                }

                if (!cancelled) setTransactions(batches);
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

    return { transactions, simulating, errored };
}
