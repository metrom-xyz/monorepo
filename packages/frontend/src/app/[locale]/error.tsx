"use client";

import { PageError } from "@/src/components/page-error";
import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return <PageError error={error} reset={reset} />;
}
