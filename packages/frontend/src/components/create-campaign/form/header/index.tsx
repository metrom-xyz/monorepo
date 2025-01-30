import { Typography } from "@metrom-xyz/ui";
import styles from "./styles.module.css";
import { ChevronLeft } from "@/src/assets/chevron-left";
import { useTranslations } from "next-intl";
import { useRouter } from "@/src/i18n/routing";
import type { CampaignType } from "@/src/types";

interface FormHeaderProps {
    type: CampaignType;
}

const CAMPAIGN_TYPE_TITLE: Record<CampaignType, string> = {
    "amm-pool-liquidity": "type.amm",
    "liquity-v2": "type.liquityV2",
};

export function FormHeader({ type }: FormHeaderProps) {
    const t = useTranslations("newCampaign");
    const router = useRouter();

    function handleBackOnClick() {
        router.back();
    }

    return (
        <div className={styles.root}>
            <div onClick={handleBackOnClick} className={styles.back}>
                <ChevronLeft />
            </div>
            <Typography
                weight="medium"
                size="lg"
                uppercase
                className={styles.title}
            >
                {t(CAMPAIGN_TYPE_TITLE[type])}
            </Typography>
        </div>
    );
}
