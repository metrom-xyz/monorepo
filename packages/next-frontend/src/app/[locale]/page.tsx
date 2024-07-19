import { useTranslations } from "next-intl";

export default function Home() {
    const t = useTranslations("all_campaigns");

    return <>{t("title")}</>;
}
