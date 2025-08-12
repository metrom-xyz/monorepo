"use client";

import { useCampaigns } from "@/src/hooks/useCampaigns";
import { ProjectOpportunitiesBanner } from "./project-opportunities-banner";
import { CampaignsTable } from "../campaigns-table";

import styles from "./styles.module.css";

export function Campaigns() {
    const { loading: loadingCampaigns, campaigns } = useCampaigns();

    return (
        <div className={styles.root}>
            <ProjectOpportunitiesBanner />
            <CampaignsTable campaigns={campaigns} loading={loadingCampaigns} />
        </div>
    );
}
