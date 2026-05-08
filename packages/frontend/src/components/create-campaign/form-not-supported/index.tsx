import { Button, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import {
    BaseCampaignType,
    DistributablesType,
    PartnerCampaignType,
    type CampaignType,
} from "@metrom-xyz/sdk";
import type { TranslationsKeys } from "@/src/types/utils";
import { Link } from "@/src/i18n/routing";
import { notFound } from "next/navigation";

import styles from "./styles.module.css";
import { EmptyIcon } from "@/src/assets/empty-icon";
import { BoldText } from "../../bold-text";
import { ArrowLeftIcon } from "@/src/assets/arrow-left-icon";

interface FormNotSupportedProps {
    type: CampaignType;
    distributablesType?: DistributablesType;
}

const CAMPAIGN_TYPE_TRANSLATION: Record<
    CampaignType,
    TranslationsKeys<"newCampaign.formHeader">
> = {
    [BaseCampaignType.AmmPoolLiquidity]: "type.amm",
    [BaseCampaignType.LiquityV2]: "type.liquityV2",
    [BaseCampaignType.AaveV3]: "type.aaveV3",
    [BaseCampaignType.HoldFungibleAsset]: "type.holdFungibleAsset",
    [BaseCampaignType.Odyssey]: "type.odyssey",
    [BaseCampaignType.Erc4626Vault]: "type.erc4626Vault",
    [PartnerCampaignType.AaveV3BridgeAndSupply]: "type.aaveV3BridgeAndSupply",
    [PartnerCampaignType.JumperWhitelistedAmmPoolLiquidity]:
        "type.jumperWhitelistedAmmPoolLiquidity",
};

const DISTRIBUTABLES_TYPE_TRANSLATION: Record<
    DistributablesType,
    TranslationsKeys<"newCampaign.formHeader">
> = {
    [DistributablesType.Tokens]: "distributables.tokens",
    [DistributablesType.FixedPoints]: "distributables.points",
    [DistributablesType.DynamicPoints]: "distributables.dynamicPoints",
    [DistributablesType.NoDistributables]: "distributables.noDistributables",
};

export function FormNotSupported({
    type,
    distributablesType,
}: FormNotSupportedProps) {
    const t = useTranslations("newCampaign");

    if (type && !CAMPAIGN_TYPE_TRANSLATION[type]) notFound();
    if (
        distributablesType &&
        !DISTRIBUTABLES_TYPE_TRANSLATION[distributablesType]
    )
        notFound();

    return (
        <div className={styles.root}>
            <EmptyIcon className={styles.icon} />
            <div className={styles.text}>
                <Typography>
                    {distributablesType
                        ? t.rich("empty.message1", {
                              campaignType: t(
                                  `formHeader.${CAMPAIGN_TYPE_TRANSLATION[type]}`,
                              ).toUpperCase(),
                              distributablesType: t(
                                  `formHeader.${DISTRIBUTABLES_TYPE_TRANSLATION[distributablesType]}`,
                              ).toUpperCase(),
                              bold: (chunks) => <BoldText>{chunks}</BoldText>,
                          })
                        : t.rich("empty.message2", {
                              campaignType: t(
                                  `formHeader.${CAMPAIGN_TYPE_TRANSLATION[type]}`,
                              ).toUpperCase(),
                              bold: (chunks) => <BoldText>{chunks}</BoldText>,
                          })}
                </Typography>
                <Typography size="sm">{t("empty.message3")}</Typography>
            </div>
            <Link href="/campaigns/create">
                <Button icon={ArrowLeftIcon} size="sm">
                    {t("empty.backToCreate")}
                </Button>
            </Link>
        </div>
    );
}
