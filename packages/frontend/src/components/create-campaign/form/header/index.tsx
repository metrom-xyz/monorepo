import { Typography } from "@metrom-xyz/ui";
import styles from "./styles.module.css";
import { ChevronLeft } from "@/src/assets/chevron-left";
import { useTranslations } from "next-intl";
import { useRouter } from "@/src/i18n/routing";
import type { TargetType } from "@metrom-xyz/sdk";

interface FormHeaderProps {
    target: TargetType;
}

const CAMPAIGN_TYPE_TITLE: Record<TargetType, string> = {
    "amm-pool-liquidity": "type.amm",
    "liquity-v2-debt": "type.liquityV2",
    "liquity-v2-collateral": "type.liquityV2",
    "liquity-v2-stability-pool": "type.liquityV2",
};

export function FormHeader({ target }: FormHeaderProps) {
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
                {t(CAMPAIGN_TYPE_TITLE[target])}
            </Typography>
        </div>
    );
}
