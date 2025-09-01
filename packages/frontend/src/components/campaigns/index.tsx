"use client";

import { useCampaigns } from "@/src/hooks/useCampaigns";
import { ProjectOpportunitiesBanner } from "./project-opportunities-banner";
import { CampaignsTable } from "../campaigns-table";
import { CHAIN_TYPE } from "@/src/commons";

import styles from "./styles.module.css";

export function Campaigns() {
    const { loading: loadingCampaigns, campaigns } = useCampaigns({
        chainType: CHAIN_TYPE,
    });

    return (
        <div className={styles.root}>
            <ProjectOpportunitiesBanner />
            <CampaignsTable campaigns={campaigns} loading={loadingCampaigns} />
        </div>
    );
}
