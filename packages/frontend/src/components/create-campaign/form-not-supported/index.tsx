import { Button, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import {
    BaseCampaignType,
    PartnerCampaignType,
    type CampaignType,
} from "@metrom-xyz/sdk";
import { useChainData } from "@/src/hooks/useChainData";
import type { TranslationsKeys } from "@/src/types/utils";
import { Link } from "@/src/i18n/routing";

import styles from "./styles.module.css";

interface FormNotSupportedProps {
    type?: CampaignType;
    chainId?: number;
}

const CAMPAIGN_TYPE_TRANSLATION: Record<
    CampaignType,
    TranslationsKeys<"newCampaign">
> = {
    [BaseCampaignType.AmmPoolLiquidity]: "type.amm",
    [BaseCampaignType.LiquityV2]: "type.liquityV2",
    [BaseCampaignType.AaveV3]: "type.aaveV3",
    [BaseCampaignType.HoldToken]: "type.holdToken",
    [PartnerCampaignType.AaveV3BridgeAndSupply]: "type.aaveV3BridgeAndSupply",
    [PartnerCampaignType.JumperWhitelistedAmmPoolLiquidity]:
        "type.jumperWhitelistedAmmPoolLiquidity",
};

export function FormNotSupported({ type, chainId }: FormNotSupportedProps) {
    const t = useTranslations("newCampaign");
    const chainData = useChainData({ chainId });

    return (
        <div className={styles.root}>
            <Typography weight="medium" size="lg">
                {type
                    ? t("empty.message2", {
                          campaignType: t(CAMPAIGN_TYPE_TRANSLATION[type]),
                          chain: chainData?.name || "",
                      })
                    : t("empty.message1", { chain: chainData?.name || "" })}
            </Typography>
            <Typography weight="medium" size="lg">
                {t("empty.message3")}
            </Typography>
            <Link href="/campaigns/create">
                <Button size="sm">{t("empty.backToCreate")}</Button>
            </Link>
        </div>
    );
}
