"use client";

import type { SupportedChain } from "@metrom-xyz/contracts";
import { useCampaign } from "@/src/hooks/useCampaign";
import type { Hex } from "viem";
import { useRouter } from "@/src/navigation";
import { Nav } from "../nav";
import { Header, SkeletonHeader } from "./header";

import styles from "./styles.module.css";

interface CampaignDetailsProps {
    chain: SupportedChain;
    campaignId: Hex;
}

export function CampaignDetails({ chain, campaignId }: CampaignDetailsProps) {
    const router = useRouter();
    const { loading, campaign } = useCampaign(chain, campaignId);

    return (
        <div className={styles.root}>
            <div className={styles.headerWrapper}>
                <Nav />
                {!campaign || loading ? (
                    <SkeletonHeader />
                ) : (
                    <Header campaign={campaign} />
                )}
            </div>
        </div>
    );
}
