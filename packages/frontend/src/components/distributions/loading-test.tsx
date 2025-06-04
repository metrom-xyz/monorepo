import { useTranslations } from "next-intl";

interface LoadingTextProps {
    loadingHashes: boolean;
    loadingDistributions: boolean;
    processing: boolean;
}

export function LoadingText({
    loadingHashes,
    loadingDistributions,
    processing,
}: LoadingTextProps) {
    const t = useTranslations("campaignDistributions");

    if (loadingHashes) return t("fetchingHashes");
    if (loadingDistributions) return t("fetchingDistributions");
    if (processing) return t("processingDistributions");

    return null;
}
