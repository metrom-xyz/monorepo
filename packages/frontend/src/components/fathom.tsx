"use client";

import { load, trackPageview } from "fathom-client";
import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { FATHOM_SITE_ID } from "../commons/env";

function TrackPageView() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        load(FATHOM_SITE_ID, {
            auto: false,
        });
    }, []);

    useEffect(() => {
        if (!pathname) return;

        trackPageview({
            url: pathname + searchParams?.toString(),
            referrer: document.referrer,
        });
    }, [pathname, searchParams]);

    return null;
}

export default function Fathom() {
    return (
        <Suspense fallback={null}>
            <TrackPageView />
        </Suspense>
    );
}
