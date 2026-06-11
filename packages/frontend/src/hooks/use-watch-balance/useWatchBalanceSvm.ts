import { useEffect, useState } from "react";
import type { UseWatchBalanceParams, UseWatchBalanceReturnValue } from ".";
import { useSolanaClient } from "@solana/react-hooks";
import type { ClientWatchers } from "@solana/client";

export function useWatchBalanceSvm({
    address,
    token,
    enabled = true,
}: UseWatchBalanceParams = {}): UseWatchBalanceReturnValue {
    const client = useSolanaClient();
    const [balance, setBalance] = useState<bigint | undefined>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!enabled || !token || !address) {
            setBalance(undefined);
            return;
        }

        let cancelled = false;
        let subscription: ReturnType<ClientWatchers["watchAccount"]> | null =
            null;

        setBalance(undefined);
        setLoading(true);

        const exec = async () => {
            const ataAddress = await client
                .splToken({ mint: token })
                .deriveAssociatedTokenAddress(address);

            if (cancelled) return;

            try {
                const initial = await client
                    .splToken({ mint: token })
                    .fetchBalance(address);
                if (!cancelled) setBalance(initial.amount);
            } catch (error) {
                console.error(
                    `Could not fetch balance for Solana token: ${error}`,
                );
            } finally {
                if (!cancelled) setLoading(false);
            }

            if (cancelled) return;

            subscription = client.watchers.watchAccount(
                { address: ataAddress },
                async () => {
                    if (cancelled) return;
                    try {
                        const b = await client
                            .splToken({ mint: token })
                            .fetchBalance(address);
                        if (cancelled) return;
                        setBalance(b.amount);
                    } catch (error) {
                        console.error(
                            `Could not refetch balance for Solana token: ${error}`,
                        );
                    }
                },
            );
        };

        exec();

        return () => {
            cancelled = true;
            subscription?.abort();
        };
    }, [enabled, token, address, client]);

    return { balance, loading };
}
