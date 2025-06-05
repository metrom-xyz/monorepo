import { useTranslations } from "next-intl";

interface LoadingTextProps {
    loading: boolean;
    processing: boolean;
}

export function LoadingText({ loading, processing }: LoadingTextProps) {
    const t = useTranslations("campaignDistributions");

    if (loading) return t("fetchingDistributions");
    if (processing) return t("processingDistributions");

    return null;
}
