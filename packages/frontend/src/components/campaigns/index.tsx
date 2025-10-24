"use client";

import { ProjectOpportunitiesBanner } from "./project-opportunities-banner";
import { CampaignsTable } from "../campaigns-table";

import styles from "./styles.module.css";

export function Campaigns() {
    return (
        <div className={styles.root}>
            <ProjectOpportunitiesBanner />
            <CampaignsTable />
        </div>
    );
}
