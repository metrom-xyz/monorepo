import { useTranslations } from "next-intl";

export default function CampaignsCreate() {
    const t = useTranslations("new_campaign");

    return <>{t("title")}</>;
}
