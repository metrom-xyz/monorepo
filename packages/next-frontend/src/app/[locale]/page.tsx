import { useTranslations } from "next-intl";

export default function Home() {
    const t = useTranslations("all_campaigns");

    // TODO: implement Typography component
    return <p className="dark:text-white">{t("title")}</p>;
}
