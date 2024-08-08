import { Typography } from "@/src/ui/typography";
import { useTranslations } from "next-intl";

export default function Home() {
    const t = useTranslations("allCampaigns");

    return (
        <Typography uppercase weight="bold">
            {t("title")}
        </Typography>
    );
}
