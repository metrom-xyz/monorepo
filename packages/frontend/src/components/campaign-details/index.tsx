"use client";

import type { SupportedChain } from "@metrom-xyz/contracts";
import { useRouter } from "@/src/navigation";
import { Nav } from "../nav";

import styles from "./styles.module.css";

interface CampaignDetailsProps {
    chain: SupportedChain;
    campaignId: string;
}

export function CampaignDetails({ chain, campaignId }: CampaignDetailsProps) {
    const router = useRouter();

    return (
        <div className={styles.root}>
            <div className={styles.headerWrapper}>
                <Nav />
                <div className={styles.header}>
                    campaign details:
                    <p>{chain}</p>
                    <p>{campaignId}</p>
                </div>
            </div>
        </div>
    );
}
