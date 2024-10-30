import { useTranslations } from "next-intl";
import { LoadingCreateCampaignForm } from "./form/loading";

import styles from "./styles.module.css";

export function LoadingCreateCampaign() {
    const t = useTranslations("newCampaign");

    return (
        <div className={styles.root}>
            <LoadingCreateCampaignForm />
        </div>
    );
}
