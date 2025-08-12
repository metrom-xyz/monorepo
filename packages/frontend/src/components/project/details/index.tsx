import {
    CampaignDuration,
    CampaignDurationSkeleton,
} from "../../campaign-duration";
import { useEffect, useState } from "react";

import styles from "./styles.module.css";

interface DetailsProps {
    from?: number;
    to?: number;
}

export function Details({ from, to }: DetailsProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className={styles.root}>
            {mounted && from && to ? (
                <CampaignDuration from={from} to={to} />
            ) : (
                <CampaignDurationSkeleton />
            )}
        </div>
    );
}
