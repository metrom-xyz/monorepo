import { Typography } from "@/src/ui/typography";
import { useTranslations } from "next-intl";

export default function Home() {
    const t = useTranslations("all_campaigns");

    return (
        <Typography uppercase weight="bold">
            {t("title")}
        </Typography>
    );
}
