import { useAccount } from "wagmi";
import { metromApiClient } from "../commons";
import { type Claim } from "@metrom-xyz/sdk";
import { useEffect, useState } from "react";

export function useClaims(): {
    loading: boolean;
    claims: Claim[];
} {
    const { address } = useAccount();

    const [claims, setClaims] = useState<Claim[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function fetchData() {
            if (!address) return;

            if (!cancelled) setLoading(false);
            if (!cancelled) setClaims([]);

            try {
                if (!cancelled) setLoading(true);
                const claims = await metromApiClient.fetchClaims({
                    address,
                });
                if (!cancelled) setClaims(claims);
            } catch (error) {
                console.error(
                    `Could not fetch claims for address ${address}: ${error}`,
                );
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        fetchData();
        return () => {
            cancelled = true;
        };
    }, [address]);

    return {
        loading,
        claims,
    };
}
