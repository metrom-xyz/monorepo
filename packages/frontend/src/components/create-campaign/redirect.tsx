"use client";

import { useRouter } from "@/src/i18n/routing";
import { type Form } from "@metrom-xyz/chains";
import { useEffect } from "react";
import { SkeletonForm } from "./skeleton-form";

interface RedirectProps {
    supported: Form[];
}

export function Redirect({ supported }: RedirectProps) {
    const router = useRouter();

    useEffect(() => {
        if (supported.length > 1) return;
        router.replace(`/campaigns/create/${supported[0].type}`);
    }, [router, supported]);

    return <SkeletonForm />;
}
