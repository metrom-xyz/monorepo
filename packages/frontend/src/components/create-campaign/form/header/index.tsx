import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import type { TranslationsKeys } from "@/src/types/utils";
import type { CampaignType } from "@metrom-xyz/sdk";

import styles from "./styles.module.css";

interface FormHeaderProps {
    type: CampaignType;
}

export const CAMPAIGN_TYPE_TITLE: Record<
    CampaignType,
    TranslationsKeys<"newCampaign.formHeader.type">
> = {
    "amm-pool-liquidity": "amm",
    "liquity-v2": "liquityV2",
    "aave-v3": "aaveV3",
    "hold-fungible-asset": "holdFungibleAsset",
    odyssey: "odyssey",
    "aave-v3-bridge-and-supply": "aaveV3BridgeAndSupply",
    "jumper-whitelisted-amm-pool-liquidity":
        "jumperWhitelistedAmmPoolLiquidity",
};

export function FormHeader({ type }: FormHeaderProps) {
    const t = useTranslations("newCampaign.formHeader");

    return (
        <div className={styles.root}>
            <Typography weight="semibold" size="xl2">
                {t("createYourCampaign", {
                    campaignType: t(`type.${CAMPAIGN_TYPE_TITLE[type]}`),
                })}
            </Typography>
        </div>
    );
}
