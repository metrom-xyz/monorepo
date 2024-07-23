import { useTranslations } from "next-intl";

export default function CampaignsCreate() {
    const t = useTranslations("new_campaign");

    return <p className="dark:text-white">{t("title")}</p>;
}
