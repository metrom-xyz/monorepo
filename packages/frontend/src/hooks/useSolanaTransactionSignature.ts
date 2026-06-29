import type {
    Signature,
    SolanaRpcResponse,
    TransactionError,
} from "@solana/kit";
import { useSolanaClient } from "@solana/react-hooks";
import { useCallback } from "react";

interface UseSolanaTransactionSignatureReturnValue {
    waitForConfirmationAsync: (signature: Signature) => Promise<void>;
}

export function useSolanaTransactionSignature(): UseSolanaTransactionSignatureReturnValue {
    const client = useSolanaClient();

    const waitForConfirmationAsync = useCallback(
        (signature: Signature): Promise<void> => {
            return new Promise((resolve, reject) => {
                const watcher = client.watchers.watchSignature(
                    { signature, commitment: "confirmed" },
                    (notification) => {
                        watcher.abort();
                        const { value } = notification as SolanaRpcResponse<
                            Readonly<{
                                err: TransactionError | null;
                            }>
                        >;

                        if (value?.err) reject(value.err);
                        else resolve();
                    },
                );
            });
        },
        [client.watchers],
    );

    return { waitForConfirmationAsync };
}
