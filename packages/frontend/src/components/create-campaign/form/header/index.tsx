import { Typography } from "@metrom-xyz/ui";
import styles from "./styles.module.css";
import { ChevronLeft } from "@/src/assets/chevron-left";
import { useTranslations } from "next-intl";
import { useRouter } from "@/src/i18n/routing";
import type { CampaignType } from "@/src/types/campaign";
import type { TranslationsKeys } from "@/src/types/utils";

interface FormHeaderProps {
    type: CampaignType;
}

const CAMPAIGN_TYPE_TITLE: Record<
    CampaignType,
    TranslationsKeys<"newCampaign.type">
> = {
    "amm-pool-liquidity": "amm",
    "liquity-v2": "liquityV2",
    "aave-v3": "aaveV3",
    "aave-v3-bridge-and-supply": "aaveV3BridgeAndSupply",
    "jumper-whitelisted-amm-pool-liquidity":
        "jumperWhitelistedAmmPoolLiquidity",
};

export function FormHeader({ type }: FormHeaderProps) {
    const t = useTranslations("newCampaign.type");
    const router = useRouter();

    function handleBackOnClick() {
        router.push("/campaigns/create");
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
