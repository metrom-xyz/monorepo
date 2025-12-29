import { useTranslations } from "next-intl";
import { SearchOffIcon } from "@/src/assets/search-off-icon";
import { EmptyState } from "../../empty-state";

import styles from "./styles.module.css";

export function EmptyTable() {
    const t = useTranslations("allCampaigns");

    return (
        <div className={styles.root}>
            <EmptyState
                title={t("empty.title")}
                subtitle={t("empty.description")}
                icon={SearchOffIcon}
            />
        </div>
    );
}
