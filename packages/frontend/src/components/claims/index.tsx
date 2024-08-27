"use client";

import { useClaims } from "@/src/hooks/useClaims";

export function Claims() {
    const { loading, claims } = useClaims();

    // TODO: remove this
    console.log({ loading, claims });

    return <div>Claims</div>;
}
