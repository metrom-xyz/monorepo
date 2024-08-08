import { CreateCampaign } from "@/src/components/create-campaign";
import { useTranslations } from "next-intl";

export default function CampaignsCreate() {
    const t = useTranslations("newCampaign");

    return <CreateCampaign />;
}
